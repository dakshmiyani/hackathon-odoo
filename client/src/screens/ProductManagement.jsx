// import React, { useEffect, useState } from "react";
// import {
//   Package,
//   Plus,
//   Search,
//   Edit,
//   Trash2,
//   X,
//   RefreshCw
// } from "lucide-react";
// import axios from "axios";

// export default function ProductsManagement() {
//   // ---------- state ----------
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const user = JSON.parse(localStorage.getItem("user"));

//   // add form
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     sku: "",
//     category: "",
//     unit: "",
//     perUnitCost: "",
//     stock: "",
//     lowStockLevel: "",
//   });

//   // edit form (object or null)
//   const [editProduct, setEditProduct] = useState(null);

//   const categories = ["All Categories", "Raw Materials", "Furniture", "Supplies", "Electronics"];

//   // ---------- utility ----------
//   const getStatusColor = (status) => {
//     if (status === "In Stock") return "bg-green-100 text-green-700";
//     if (status === "Low Stock") return "bg-amber-100 text-amber-700";
//     if (status === "Out of Stock") return "bg-red-100 text-red-700";
//     return "bg-gray-100 text-gray-700";
//   };

//   // Map backend product to UI product
//   const mapBackendToUI = (p, i) => {
//     const stock = Number(p.stock ?? 0);
//     const lowStockLevel = Number(p.lowStockLevel ?? 0);
//     const freeToUse = (p.freeToUse ?? (stock - lowStockLevel)) ?? stock - lowStockLevel;

//     const status = stock === 0 ? "Out of Stock" : stock <= lowStockLevel ? "Low Stock" : "In Stock";

//     return {
//       id: p._id ?? p.id ?? i + 1,
//       name: p.productName ?? p.name ?? "",
//       sku: p.sku ?? "",
//       category: p.category ?? "",
//       unit: p.unit ?? "",
//       perUnitCost: Number(p.perUnitCost ?? 0),
//       stock,
//       lowStockLevel,
//       freeToUse,
//       status,
//       raw: p, // keep raw backend object if needed
//     };
//   };

//   // ---------- fetch products ----------
//   // const fetchProducts = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const res = await axios.get("http://localhost:5000/api/products");
//   //     if (res?.data && Array.isArray(res.data)) {
//   //       const mapped = res.data.map(mapBackendToUI);
//   //       setProducts(mapped);
//   //     } else {
//   //       // if backend does not return array, just keep existing
//   //     }
//   //   } catch (err) {
//   //     // silently ignore; UI will work with locally added items
//   //     // console.warn("Fetch products failed:", err.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchProducts();
//   // }, []);

//   // ---------- add product ----------
//   const handleAddProduct = async () => {
//     if (!newProduct.name?.trim() || !newProduct.sku?.trim() || !newProduct.category) {
//       alert("Please fill required fields: Product Name, SKU and Category.");
//       return;
//     }

//     const stock = Number(newProduct.stock || 0);
//     const lowStockLevel = Number(newProduct.lowStockLevel || 0);
//     const perUnitCost = Number(newProduct.perUnitCost || 0);

//     // freeToUse per your request = stock - lowStockLevel
//     const freeToUse = stock - lowStockLevel;

//     const body = {
//       productName: newProduct.name.trim(),
//       sku: newProduct.sku.trim(),
//       category: newProduct.category,
//       unit: newProduct.unit || "",
//       perUnitCost,
//       stock,
//       freeToUse,
//       lowStockLevel,
//     };

//     try {
//       const res = await axios.post("http://localhost:5000/api/products/add", body);

//       // if backend returns the created product, map and use it; otherwise synthesize
//       const backendProduct = res?.data;
//       const uiProduct = backendProduct ? mapBackendToUI(backendProduct) : {
//         id: `tmp-${Date.now()}`,
//         name: body.productName,
//         sku: body.sku,
//         category: body.category,
//         unit: body.unit,
//         perUnitCost,
//         stock,
//         lowStockLevel,
//         freeToUse,
//         status: stock === 0 ? "Out of Stock" : stock <= lowStockLevel ? "Low Stock" : "In Stock",
//       };

//       setProducts((prev) => [...prev, uiProduct]);
//       setShowAddModal(false);
//       setNewProduct({ name: "", sku: "", category: "", unit: "", perUnitCost: "", stock: "", lowStockLevel: "" });

//       alert("Product added successfully!");
//     } catch (error) {
//       console.error("Add product failed:", error?.response?.data || error.message);
//       alert(error?.response?.data?.message || "Failed to add product. See console for details.");
//     }
//   };

//   // ---------- delete product ----------
//   const handleDelete = async (prod) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;

//     // try backend delete if id looks like a backend id
//     try {
//       // If product.id is backend id, call delete endpoint
//       // backend expected: DELETE /api/products/:id
//       await axios.delete(`http://localhost:5000/api/products/delete/${prod.id}`);
//     } catch (err) {
//       // ignore backend error; proceed to remove from UI nevertheless
//       // console.warn("Delete backend failed (maybe endpoint absent):", err.message);
//     } finally {
//       setProducts((prev) => prev.filter((p) => p.id !== prod.id));
//       alert("Product removed.");
//     }
//   };

//   // ---------- open edit ----------
//   const openEdit = (product) => {
//     // prepare a safe copy for editing
//     setEditProduct({
//       ...product,
//       // keep numeric fields consistent as strings to allow editing easily in inputs
//       perUnitCost: product.perUnitCost ?? 0,
//       stock: product.stock ?? 0,
//       lowStockLevel: product.lowStockLevel ?? 0,
//     });
//     setShowEditModal(true);
//   };

//   // ---------- update product ----------
//   const handleUpdateProduct = async () => {
//     if (!editProduct) return;

//     const id = editProduct.id;
//     const stock = Number(editProduct.stock || 0);
//     const lowStockLevel = Number(editProduct.lowStockLevel || 0);
//     const perUnitCost = Number(editProduct.perUnitCost || 0);
//     const freeToUse = stock - lowStockLevel;

//     const body = {
//       productName: editProduct.name,
//       sku: editProduct.sku,
//       category: editProduct.category,
//       unit: editProduct.unit,
//       perUnitCost,
//       stock,
//       freeToUse,
//       lowStockLevel,
//     };

//     try {
//       // PUT /api/products/:id
//       await axios.put(`http://localhost:5000/api/products/update/${id}`, body);

//       // update UI
//       setProducts((prev) =>
//         prev.map((p) =>
//           p.id === id
//             ? {
//                 ...p,
//                 name: body.productName,
//                 sku: body.sku,
//                 category: body.category,
//                 unit: body.unit,
//                 perUnitCost: perUnitCost,
//                 stock,
//                 lowStockLevel,
//                 freeToUse,
//                 status: stock === 0 ? "Out of Stock" : stock <= lowStockLevel ? "Low Stock" : "In Stock",
//               }
//             : p
//         )
//       );

//       setShowEditModal(false);
//       setEditProduct(null);
//       alert("Product updated successfully!");
//     } catch (error) {
//       console.error("Update product failed:", error?.response?.data || error.message);
//       alert(error?.response?.data?.message || "Update failed. See console for details.");
//     }
//   };

//   // ---------- filtered products ----------
//   const filteredProducts = products.filter((p) => {
//     const q = searchQuery.trim().toLowerCase();
//     const matchesSearch =
//       !q ||
//       (p.name || "").toLowerCase().includes(q) ||
//       (p.sku || "").toLowerCase().includes(q);
//     const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   // ---------- UI ----------
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
//         <p className="text-gray-600">Manage your product inventory and stock levels</p>
//       </div>

//       {/* Action Bar */}
//       <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
//         <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
//           <div className="flex flex-col sm:flex-row gap-3 flex-1">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name or SKU..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//             </div>

//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-700"
//             >
//               <option value="all">All Categories</option>
//               {categories.slice(1).map((c) => (
//                 <option key={c} value={c}>{c}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => fetchProducts()}
//               title="Refresh"
//               className="p-2 rounded-lg hover:bg-gray-100"
//             >
//               <RefreshCw className="w-5 h-5 text-gray-600" />
//             </button>

//             <button
//               onClick={() => setShowAddModal(true)}
//               className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
//             >
//               <Plus className="w-5 h-5" />
//               Add Product
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl p-4 shadow-sm">
//           <p className="text-gray-600 text-sm mb-1">Total Products</p>
//           <p className="text-2xl font-bold text-gray-900">{products.length}</p>
//         </div>
//         <div className="bg-white rounded-xl p-4 shadow-sm">
//           <p className="text-gray-600 text-sm mb-1">In Stock</p>
//           <p className="text-2xl font-bold text-green-600">{products.filter(p => p.status === 'In Stock').length}</p>
//         </div>
//         <div className="bg-white rounded-xl p-4 shadow-sm">
//           <p className="text-gray-600 text-sm mb-1">Low Stock</p>
//           <p className="text-2xl font-bold text-amber-600">{products.filter(p => p.status === 'Low Stock').length}</p>
//         </div>
//         <div className="bg-white rounded-xl p-4 shadow-sm">
//           <p className="text-gray-600 text-sm mb-1">Out of Stock</p>
//           <p className="text-2xl font-bold text-red-600">{products.filter(p => p.status === 'Out of Stock').length}</p>
//         </div>
//       </div>

//       {/* Desktop Table */}
//       <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b border-gray-200">
//             <tr>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product Name</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SKU</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Unit</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">PricePerUnit</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Free to Use</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Low Stock Level</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-100">
//             {filteredProducts.map((product) => (
//               <tr key={product.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
//                       <Package className="w-5 h-5 text-white" />
//                     </div>
//                     <span className="font-medium text-gray-900">{product.name}</span>
//                   </div>
//                 </td>

//                 <td className="px-6 py-4 text-gray-600">{product.sku}</td>
//                 <td className="px-6 py-4">
//                   <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{product.category}</span>
//                 </td>

//                 <td className="px-6 py-4"><span className="font-semibold text-gray-900">{product.stock}</span></td>
//                 <td className="px-6 py-4 text-gray-600">{product.unit}</td>
//                 <td className="px-6 py-4 text-gray-600">{product.perUnitCost}</td>
//                 <td className="px-6 py-4 text-gray-900">{product.freeToUse ?? (product.stock - (product.lowStockLevel ?? 0))}</td>
//                 <td className="px-6 py-4 text-gray-900">{product.lowStockLevel ?? "-"}</td>

//                 <td className="px-6 py-4">
//                   <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(product.status)}`}>
//                     {product.status}
//                   </span>
//                 </td>

//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => openEdit(product)}
//                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                     >
//                       <Edit className="w-4 h-4" />
//                     </button>

//                     <button
//                       onClick={() => handleDelete(product)}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}

//             {filteredProducts.length === 0 && (
//               <tr>
//                 <td colSpan={9} className="text-center py-12 text-gray-400">No products found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Cards */}
//       <div className="lg:hidden space-y-4">
//         {filteredProducts.map((product) => (
//           <div key={product.id} className="bg-white rounded-xl shadow-sm p-4">
//             <div className="flex items-start justify-between mb-3">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
//                   <Package className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">{product.name}</h3>
//                   <p className="text-sm text-gray-500">{product.sku}</p>
//                 </div>
//               </div>

//               <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(product.status)}`}>
//                 {product.status}
//               </span>
//             </div>

//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div>
//                 <p className="text-gray-500">Category</p>
//                 <p className="font-medium text-gray-900">{product.category}</p>
//               </div>

//               <div>
//                 <p className="text-gray-500">Stock</p>
//                 <p className="font-medium text-gray-900">{product.stock} {product.unit}</p>
//               </div>

//               <div>
//                 <p className="text-gray-500">Free to Use</p>
//                 <p className="font-medium text-gray-900">{product.freeToUse ?? (product.stock - (product.lowStockLevel ?? 0))}</p>
//               </div>

//               <div>
//                 <p className="text-gray-500">Low Stock Level</p>
//                 <p className="font-medium text-gray-900">{product.lowStockLevel ?? "-"}</p>
//               </div>
//             </div>

//             <div className="flex gap-2 mt-4 pt-4 border-t">
//               <button onClick={() => openEdit(product)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center gap-2">
//                 <Edit className="w-4 h-4" /> Edit
//               </button>

//               <button onClick={() => handleDelete(product)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2">
//                 <Trash2 className="w-4 h-4" /> Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-6 border-b">
//               <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
//               <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
//                   <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Enter product name" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">SKU / Code</label>
//                   <input type="text" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g., SR-001" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                   <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
//                     <option value="">Select category</option>
//                     <option value="Raw Materials">Raw Materials</option>
//                     <option value="Furniture">Furniture</option>
//                     <option value="Supplies">Supplies</option>
//                     <option value="Electronics">Electronics</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measure</label>
//                   <input type="text" value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g., kg, units, pieces" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Per Unit Cost</label>
//                   <input type="number" value={newProduct.perUnitCost} onChange={(e) => setNewProduct({ ...newProduct, perUnitCost: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 120" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Initial Stock</label>
//                   <input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="0" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Level</label>
//                   <input type="number" value={newProduct.lowStockLevel} onChange={(e) => setNewProduct({ ...newProduct, lowStockLevel: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="0" />
//                 </div>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
//                 <button onClick={handleAddProduct} className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl">Add Product</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && editProduct && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-6 border-b">
//               <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
//               <button onClick={() => { setShowEditModal(false); setEditProduct(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
//                   <input type="text" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">SKU / Code</label>
//                   <input type="text" value={editProduct.sku} onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                   <select value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
//                     <option value="Raw Materials">Raw Materials</option>
//                     <option value="Furniture">Furniture</option>
//                     <option value="Supplies">Supplies</option>
//                     <option value="Electronics">Electronics</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
//                   <input type="text" value={editProduct.unit} onChange={(e) => setEditProduct({ ...editProduct, unit: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Per Unit Cost</label>
//                   <input type="number" value={editProduct.perUnitCost} onChange={(e) => setEditProduct({ ...editProduct, perUnitCost: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
//                   <input type="number" value={editProduct.stock} onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Level</label>
//                   <input type="number" value={editProduct.lowStockLevel} onChange={(e) => setEditProduct({ ...editProduct, lowStockLevel: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
//                 </div>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button onClick={() => { setShowEditModal(false); setEditProduct(null); }} className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
//                 <button onClick={handleUpdateProduct} className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">Update Product</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// import React, { useState } from "react";
// import {
//   Package,
//   Plus,
//   Search,
//   Edit,
//   Trash2,
//   X,
//   RefreshCw
// } from "lucide-react";

// export default function ProductsManagement() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");

//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     sku: "",
//     category: "",
//     unit: "",
//     perUnitCost: "",
//     stock: "",
//     lowStockLevel: "",
//   });

//   const [editProduct, setEditProduct] = useState(null);

//   const categories = ["All Categories", "Raw Materials", "Furniture", "Supplies", "Electronics"];

//   const getStatusColor = (status) => {
//     if (status === "In Stock") return "bg-green-100 text-green-700";
//     if (status === "Low Stock") return "bg-amber-100 text-amber-700";
//     if (status === "Out of Stock") return "bg-red-100 text-red-700";
//     return "bg-gray-100 text-gray-700";
//   };

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       console.log("Refresh clicked - API integration pending");
//     } catch (err) {
//       console.warn("Fetch products failed:", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddProduct = async () => {
//     if (!newProduct.name?.trim() || !newProduct.sku?.trim() || !newProduct.category) {
//       alert("Please fill required fields: Product Name, SKU and Category.");
//       return;
//     }

//     const stock = Number(newProduct.stock || 0);
//     const lowStockLevel = Number(newProduct.lowStockLevel || 0);
//     const perUnitCost = Number(newProduct.perUnitCost || 0);
//     const freeToUse = stock - lowStockLevel;

//     const uiProduct = {
//       id: `tmp-${Date.now()}`,
//       name: newProduct.name.trim(),
//       sku: newProduct.sku.trim(),
//       category: newProduct.category,
//       unit: newProduct.unit || "",
//       perUnitCost,
//       stock,
//       lowStockLevel,
//       freeToUse,
//       status: stock === 0 ? "Out of Stock" : stock <= lowStockLevel ? "Low Stock" : "In Stock",
//     };

//     setProducts((prev) => [...prev, uiProduct]);
//     setShowAddModal(false);
//     setNewProduct({ name: "", sku: "", category: "", unit: "", perUnitCost: "", stock: "", lowStockLevel: "" });
//     alert("Product added successfully!");
//   };

//   const handleDelete = async (prod) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     setProducts((prev) => prev.filter((p) => p.id !== prod.id));
//     alert("Product removed successfully!");
//   };

//   const openEdit = (product) => {
//     setEditProduct({
//       ...product,
//       perUnitCost: product.perUnitCost ?? 0,
//       stock: product.stock ?? 0,
//       lowStockLevel: product.lowStockLevel ?? 0,
//     });
//     setShowEditModal(true);
//   };

//   const handleUpdateProduct = async () => {
//     if (!editProduct) return;

//     const id = editProduct.id;
//     const stock = Number(editProduct.stock || 0);
//     const lowStockLevel = Number(editProduct.lowStockLevel || 0);
//     const perUnitCost = Number(editProduct.perUnitCost || 0);
//     const freeToUse = stock - lowStockLevel;

//     setProducts((prev) =>
//       prev.map((p) =>
//         p.id === id
//           ? {
//               ...p,
//               name: editProduct.name,
//               sku: editProduct.sku,
//               category: editProduct.category,
//               unit: editProduct.unit,
//               perUnitCost: perUnitCost,
//               stock,
//               lowStockLevel,
//               freeToUse,
//               status: stock === 0 ? "Out of Stock" : stock <= lowStockLevel ? "Low Stock" : "In Stock",
//             }
//           : p
//       )
//     );

//     setShowEditModal(false);
//     setEditProduct(null);
//     alert("Product updated successfully!");
//   };

//   const filteredProducts = products.filter((p) => {
//     const q = searchQuery.trim().toLowerCase();
//     const matchesSearch =
//       !q ||
//       (p.name || "").toLowerCase().includes(q) ||
//       (p.sku || "").toLowerCase().includes(q);
//     const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
//         <p className="text-gray-600">Manage your product inventory and stock levels</p>
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
//         <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
//           <div className="flex flex-col sm:flex-row gap-3 flex-1">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name or SKU..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//             </div>

//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-700"
//             >
//               <option value="all">All Categories</option>
//               {categories.slice(1).map((c) => (
//                 <option key={c} value={c}>{c}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={fetchProducts}
//               disabled={loading}
//               title="Refresh"
//               className={`p-3 rounded-lg hover:bg-gray-100 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//             >
//               <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
//             </button>

//             <button
//               onClick={() => setShowAddModal(true)}
//               className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
//             >
//               <Plus className="w-5 h-5" />
//               Add Product
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl p-4 shadow-sm">
//           <p className="text-gray-600 text-sm mb-1">Total Products</p>
//           <p className="text-2xl font-bold text-gray-900">{products.length}</p>
//         </div>
//         <div className="bg-white rounded-xl p-4 shadow-sm">
//           <p className="text-gray-600 text-sm mb-1">In Stock</p>
//           <p className="text-2xl font-bold text-green-600">{products.filter(p => p.status === 'In Stock').length}</p>
//         </div>
//         <div className="bg-white rounded-xl p-4 shadow-sm">
//           <p className="text-gray-600 text-sm mb-1">Low Stock</p>
//           <p className="text-2xl font-bold text-amber-600">{products.filter(p => p.status === 'Low Stock').length}</p>
//         </div>
//         <div className="bg-white rounded-xl p-4 shadow-sm">
//           <p className="text-gray-600 text-sm mb-1">Out of Stock</p>
//           <p className="text-2xl font-bold text-red-600">{products.filter(p => p.status === 'Out of Stock').length}</p>
//         </div>
//       </div>

//       <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b border-gray-200">
//             <tr>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product Name</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SKU</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Unit</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price/Unit</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Free to Use</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Low Stock</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-100">
//             {filteredProducts.map((product) => (
//               <tr key={product.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
//                       <Package className="w-5 h-5 text-white" />
//                     </div>
//                     <span className="font-medium text-gray-900">{product.name}</span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-gray-600">{product.sku}</td>
//                 <td className="px-6 py-4">
//                   <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{product.category}</span>
//                 </td>
//                 <td className="px-6 py-4"><span className="font-semibold text-gray-900">{product.stock}</span></td>
//                 <td className="px-6 py-4 text-gray-600">{product.unit}</td>
//                 <td className="px-6 py-4 text-gray-900">₹{product.perUnitCost}</td>
//                 <td className="px-6 py-4 text-gray-900">{product.freeToUse}</td>
//                 <td className="px-6 py-4 text-gray-900">{product.lowStockLevel}</td>
//                 <td className="px-6 py-4">
//                   <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(product.status)}`}>
//                     {product.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => openEdit(product)}
//                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                     >
//                       <Edit className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product)}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {filteredProducts.length === 0 && (
//               <tr>
//                 <td colSpan={10} className="text-center py-12 text-gray-400">No products found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="lg:hidden space-y-4">
//         {filteredProducts.map((product) => (
//           <div key={product.id} className="bg-white rounded-xl shadow-sm p-4">
//             <div className="flex items-start justify-between mb-3">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
//                   <Package className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">{product.name}</h3>
//                   <p className="text-sm text-gray-500">{product.sku}</p>
//                 </div>
//               </div>
//               <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(product.status)}`}>
//                 {product.status}
//               </span>
//             </div>
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div>
//                 <p className="text-gray-500">Category</p>
//                 <p className="font-medium text-gray-900">{product.category}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Stock</p>
//                 <p className="font-medium text-gray-900">{product.stock} {product.unit}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Price/Unit</p>
//                 <p className="font-medium text-gray-900">₹{product.perUnitCost}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Free to Use</p>
//                 <p className="font-medium text-gray-900">{product.freeToUse}</p>
//               </div>
//             </div>
//             <div className="flex gap-2 mt-4 pt-4 border-t">
//               <button onClick={() => openEdit(product)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center gap-2">
//                 <Edit className="w-4 h-4" /> Edit
//               </button>
//               <button onClick={() => handleDelete(product)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2">
//                 <Trash2 className="w-4 h-4" /> Delete
//               </button>
//             </div>
//           </div>
//         ))}
//         {filteredProducts.length === 0 && (
//           <div className="text-center py-12 text-gray-400 bg-white rounded-xl">No products found.</div>
//         )}
//       </div>

//       {showAddModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-6 border-b">
//               <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
//               <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
//                   <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Enter product name" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">SKU / Code *</label>
//                   <input type="text" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g., SR-001" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
//                   <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
//                     <option value="">Select category</option>
//                     <option value="Raw Materials">Raw Materials</option>
//                     <option value="Furniture">Furniture</option>
//                     <option value="Supplies">Supplies</option>
//                     <option value="Electronics">Electronics</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measure</label>
//                   <input type="text" value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="kg, units, pieces" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Per Unit Cost (₹)</label>
//                   <input type="number" step="0.01" value={newProduct.perUnitCost} onChange={(e) => setNewProduct({ ...newProduct, perUnitCost: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="0" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Initial Stock</label>
//                   <input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="0" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Level</label>
//                   <input type="number" value={newProduct.lowStockLevel} onChange={(e) => setNewProduct({ ...newProduct, lowStockLevel: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="0" />
//                 </div>
//               </div>
//               <div className="flex gap-3 pt-4">
//                 <button onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
//                 <button onClick={handleAddProduct} className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl">Add Product</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showEditModal && editProduct && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-6 border-b">
//               <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
//               <button onClick={() => { setShowEditModal(false); setEditProduct(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
//                   <input type="text" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">SKU / Code</label>
//                   <input type="text" value={editProduct.sku} onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                   <select value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
//                     <option value="Raw Materials">Raw Materials</option>
//                     <option value="Furniture">Furniture</option>
//                     <option value="Supplies">Supplies</option>
//                     <option value="Electronics">Electronics</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
//                   <input type="text" value={editProduct.unit} onChange={(e) => setEditProduct({ ...editProduct, unit: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Per Unit Cost (₹)</label>
//                   <input type="number" step="0.01" value={editProduct.perUnitCost} onChange={(e) => setEditProduct({ ...editProduct, perUnitCost: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
//                   <input type="number" value={editProduct.stock} onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Level</label>
//                   <input type="number" value={editProduct.lowStockLevel} onChange={(e) => setEditProduct({ ...editProduct, lowStockLevel: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
//                 </div>
//               </div>
//               <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
//                 <p className="text-sm text-indigo-900">
//                   <span className="font-semibold">Free to Use:</span> {Number(editProduct.stock || 0) - Number(editProduct.lowStockLevel || 0)} units
//                 </p>
//               </div>
//               <div className="flex gap-3 pt-4">
//                 <button onClick={() => { setShowEditModal(false); setEditProduct(null); }} className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
//                 <button onClick={handleUpdateProduct} className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">Update Product</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// src/pages/ProductsManagement.js
// Beautiful UI + full backend integration (Add / Edit / Delete / Fetch)
// Design spec (local file): /mnt/data/StockMaster.pdf
// The path above will be transformed to a URL by your environment if needed.

import React, { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  RefreshCw
} from "lucide-react";
import axios from "axios";

export default function ProductsManagement() {
  // ---------- state ----------
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const user = JSON.parse(localStorage.getItem("user"));

  // add form
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    unit: "",
    perUnitCost: "",
    stock: "",
    lowStockLevel: "",
  });

  // edit form (object or null)
  const [editProduct, setEditProduct] = useState(null);

  const categories = ["All Categories", "Raw Materials", "Furniture", "Supplies", "Electronics"];

  // ---------- utility ----------
  const getStatusColor = (status) => {
    if (status === "In Stock") return "bg-green-100 text-green-700";
    if (status === "Low Stock") return "bg-amber-100 text-amber-700";
    if (status === "Out of Stock") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  // Map backend product to UI product
  const mapBackendToUI = (p, i) => {
    const stock = Number(p.stock ?? 0);
    const lowStockLevel = Number(p.lowStockLevel ?? 0);
    const freeToUse = (p.freeToUse ?? (stock - lowStockLevel)) ?? stock - lowStockLevel;

    const status = stock === 0 ? "Out of Stock" : stock <= lowStockLevel ? "Low Stock" : "In Stock";

    return {
      id: p._id ?? p.id ?? i + 1,
      name: p.productName ?? p.name ?? "",
      sku: p.sku ?? "",
      category: p.category ?? "",
      unit: p.unit ?? "",
      perUnitCost: Number(p.perUnitCost ?? 0),
      stock,
      lowStockLevel,
      freeToUse,
      status,
      raw: p, // keep raw backend object if needed
    };
  };

  // ---------- fetch products ----------
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/products/get`);
      if (res?.data && Array.isArray(res.data)) {
        const mapped = res.data.map(mapBackendToUI);
        setProducts(mapped);
      } else {
        // if backend does not return array, just keep existing
      }
    } catch (err) {
      // silently ignore; UI will work with locally added items
      // console.warn("Fetch products failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------- add product ----------
  const handleAddProduct = async () => {
    if (!newProduct.name?.trim() || !newProduct.sku?.trim() || !newProduct.category) {
      alert("Please fill required fields: Product Name, SKU and Category.");
      return;
    }

    const stock = Number(newProduct.stock || 0);
    const lowStockLevel = Number(newProduct.lowStockLevel || 0);
    const perUnitCost = Number(newProduct.perUnitCost || 0);

    // freeToUse per your request = stock - lowStockLevel
    const freeToUse = stock - lowStockLevel;

    const body = {
      productName: newProduct.name.trim(),
      sku: newProduct.sku.trim(),
      category: newProduct.category,
      unit: newProduct.unit || "",
      perUnitCost,
      stock,
      freeToUse,
      lowStockLevel,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/products/add", body);

      // if backend returns the created product, map and use it; otherwise synthesize
      const backendProduct = res?.data;
      const uiProduct = backendProduct ? mapBackendToUI(backendProduct) : {
        id: `tmp-${Date.now()}`,
        name: body.productName,
        sku: body.sku,
        category: body.category,
        unit: body.unit,
        perUnitCost,
        stock,
        lowStockLevel,
        freeToUse,
        status: stock === 0 ? "Out of Stock" : stock <= lowStockLevel ? "Low Stock" : "In Stock",
      };

      setProducts((prev) => [...prev, uiProduct]);
      setShowAddModal(false);
      setNewProduct({ name: "", sku: "", category: "", unit: "", perUnitCost: "", stock: "", lowStockLevel: "" });

      alert("Product added successfully!");
    } catch (error) {
      console.error("Add product failed:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "Failed to add product. See console for details.");
    }
  };

  // ---------- delete product ----------
  const handleDelete = async (prod) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    // try backend delete if id looks like a backend id
    try {
      // If product.id is backend id, call delete endpoint
      // backend expected: DELETE /api/products/:id
      await axios.delete(`http://localhost:5000/api/products/delete/${prod.id}`);
    } catch (err) {
      // ignore backend error; proceed to remove from UI nevertheless
      // console.warn("Delete backend failed (maybe endpoint absent):", err.message);
    } finally {
      setProducts((prev) => prev.filter((p) => p.id !== prod.id));
      alert("Product removed.");
    }
  };

  // ---------- open edit ----------
  const openEdit = (product) => {
    // prepare a safe copy for editing
    setEditProduct({
      ...product,
      // keep numeric fields consistent as strings to allow editing easily in inputs
      perUnitCost: product.perUnitCost ?? 0,
      stock: product.stock ?? 0,
      lowStockLevel: product.lowStockLevel ?? 0,
    });
    setShowEditModal(true);
  };

  // ---------- update product ----------
  const handleUpdateProduct = async () => {
    if (!editProduct) return;

    const id = editProduct.id;
    const stock = Number(editProduct.stock || 0);
    const lowStockLevel = Number(editProduct.lowStockLevel || 0);
    const perUnitCost = Number(editProduct.perUnitCost || 0);
    const freeToUse = stock - lowStockLevel;

    const body = {
      productName: editProduct.name,
      sku: editProduct.sku,
      category: editProduct.category,
      unit: editProduct.unit,
      perUnitCost,
      stock,
      freeToUse,
      lowStockLevel,
    };

    try {
      // PUT /api/products/:id
      await axios.put(`http://localhost:5000/api/products/update/${id}`, body);

      // update UI
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                name: body.productName,
                sku: body.sku,
                category: body.category,
                unit: body.unit,
                perUnitCost: perUnitCost,
                stock,
                lowStockLevel,
                freeToUse,
                status: stock === 0 ? "Out of Stock" : stock <= lowStockLevel ? "Low Stock" : "In Stock",
              }
            : p
        )
      );

      setShowEditModal(false);
      setEditProduct(null);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Update product failed:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "Update failed. See console for details.");
    }
  };

  // ---------- filtered products ----------
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (p.name || "").toLowerCase().includes(q) ||
      (p.sku || "").toLowerCase().includes(q);
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
        <p className="text-gray-600">Manage your product inventory and stock levels</p>
        <p className="text-xs text-gray-400 mt-1">Design spec: <code className="bg-white/70 px-2 py-1 rounded">{"/mnt/data/StockMaster.pdf"}</code></p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-700"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchProducts()}
              title="Refresh"
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-600 text-sm mb-1">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-600 text-sm mb-1">In Stock</p>
          <p className="text-2xl font-bold text-green-600">{products.filter(p => p.status === 'In Stock').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-600 text-sm mb-1">Low Stock</p>
          <p className="text-2xl font-bold text-amber-600">{products.filter(p => p.status === 'Low Stock').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-600 text-sm mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{products.filter(p => p.status === 'Out of Stock').length}</p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SKU</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Unit</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Free to Use</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Low Stock Level</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-600">{product.sku}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{product.category}</span>
                </td>

                <td className="px-6 py-4"><span className="font-semibold text-gray-900">{product.stock}</span></td>
                <td className="px-6 py-4 text-gray-600">{product.unit}</td>
                <td className="px-6 py-4 text-gray-900">{product.freeToUse ?? (product.stock - (product.lowStockLevel ?? 0))}</td>
                <td className="px-6 py-4 text-gray-900">{product.lowStockLevel ?? "-"}</td>

                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(product)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-400">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.sku}</p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium text-gray-900">{product.category}</p>
              </div>

              <div>
                <p className="text-gray-500">Stock</p>
                <p className="font-medium text-gray-900">{product.stock} {product.unit}</p>
              </div>

              <div>
                <p className="text-gray-500">Free to Use</p>
                <p className="font-medium text-gray-900">{product.freeToUse ?? (product.stock - (product.lowStockLevel ?? 0))}</p>
              </div>

              <div>
                <p className="text-gray-500">Low Stock Level</p>
                <p className="font-medium text-gray-900">{product.lowStockLevel ?? "-"}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <button onClick={() => openEdit(product)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" /> Edit
              </button>

              <button onClick={() => handleDelete(product)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Enter product name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU / Code</label>
                  <input type="text" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g., SR-001" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select category</option>
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measure</label>
                  <input type="text" value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g., kg, units, pieces" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Per Unit Cost</label>
                  <input type="number" value={newProduct.perUnitCost} onChange={(e) => setNewProduct({ ...newProduct, perUnitCost: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 120" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Stock</label>
                  <input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="0" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Level</label>
                  <input type="number" value={newProduct.lowStockLevel} onChange={(e) => setNewProduct({ ...newProduct, lowStockLevel: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="0" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
                <button onClick={handleAddProduct} className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl">Add Product</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
              <button onClick={() => { setShowEditModal(false); setEditProduct(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input type="text" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU / Code</label>
                  <input type="text" value={editProduct.sku} onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <input type="text" value={editProduct.unit} onChange={(e) => setEditProduct({ ...editProduct, unit: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Per Unit Cost</label>
                  <input type="number" value={editProduct.perUnitCost} onChange={(e) => setEditProduct({ ...editProduct, perUnitCost: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input type="number" value={editProduct.stock} onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Level</label>
                  <input type="number" value={editProduct.lowStockLevel} onChange={(e) => setEditProduct({ ...editProduct, lowStockLevel: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => { setShowEditModal(false); setEditProduct(null); }} className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
                <button onClick={handleUpdateProduct} className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">Update Product</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
