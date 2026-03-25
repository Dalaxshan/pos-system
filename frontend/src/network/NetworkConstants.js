export const API_CONSTANTS = {
  // Authentication
  login: 'auth/signin',
  logout: 'admin/logout',
  register: '/register',

  //supplier
  createSupplier: 'supplier',
  getAllSupplier: 'supplier',
  editSupplier: (id) => `supplier/${id}`,
  deleteSupplier: (id) => `supplier/${id}`,
  getSupplier: (id) => `supplier/${id}`,

  //items
  createItem: 'item',
  getAllItem: 'item',
  getAllSales: 'item/sales-items',
  getAllPurchase: 'item/purchase-items',
  itemById: (id) => `item/${id}`,
  deleteItem: (id) => `item/${id}`,
  getAllSingleItems: (id) => `item/supplier/${id}`,
  countCategory: 'item/count-by-category',
  getAllApprovedRecipes: 'item/approved-recipes',
  getAllRecipes: 'item/recipes',
  updateRecipeStatus: (id) => `item/recipe-status/${id}`,

  //purchase order
  createPurchase: 'purchase',
  getAllPurchasesOrder: 'purchase',
  getAggregatedAverageProfit: 'purchase/profit', 
  editPurchase: (id) => `purchase/${id}`,
  deletePurchase: (id) => `purchase/${id}`,
  getPurchaseById: (id) => `purchase/${id}`,


  //account
  viewDetail: (id) => `employee/${id}`,
  editDetail: (id) => `employee/${id}`,
  getAllLoginHistory: '/login-history',
  getAllStocks: '/stocks',
  getTopSales: 'sales/count/items',
  editLoginHistory: (id) => `/login-history/${id}`,
  getAllNotification: '/notification',

  //branch
  getAllBranches: '/branch',
  createBranch: '/branch',
  createTable: '/table',
  listTables: (id) => `/table/branch/${id}`,
  listAvailableTables: '/table',
  editBranch: (id) => `/branch/${id}`,
  deleteBranch: (id) => `/branch/${id}`,
  deleteTable: (id) => `/table/${id}`,
  getBranchById: (id) => `/branch/${id}`,

  //menu
  createMenu: 'menu',
  getAllMenu: 'menu',
  getMenu: (id) => `menu/${id}`,
  deleteMenu: (id) => `menu/${id}`,
  editMenu: (id) => `menu/${id}`,

  //sales order
  salesOrder: 'sales',
  getAllSaleOrders: 'sales',
  getSaleOrderById: (id) => `sales/${id}`,
  getTopSales: 'sales/count/items',
  updateSaleOrder: (id) => `sales/${id}`,
  updateOrderStatus: (id) => `sales/order-status/${id}`,
  updatePaymentStatus: (id) => `sales/payment-status/${id}`,
  deleteSaleOrder: (id) => `sales/${id}`,

  //Employee
  getAllEmployee: 'employee',
  getAllAdmins: 'employee/admin',
  createEmployee: 'employee',
  editEmployee: (id) => `employee/${id}`,
  deleteEmployee: (id) => `employee/${id}`,
  getEmployee: (id) => `employee/${id}`,

  //Category
  getAllCategory: 'category',
  createCategory: 'category',

  //customer
  getAllCustomer: 'customer',
  createCustomer: 'customer',
  getCustomerById: 'customer',

  //stock
  createStock: 'stock',
  getAllStock: 'stock',
  editStock: (id) => `stock/${id}`,
  deleteStock: (id) => `stock/${id}`,
  getStockById: (id) => `stock/${id}`,
  currentStock: 'stock/current',

  //recipe
  createRecipe: 'recipe',
  getRecipeById: (id) => `recipe/${id}`,
  editRecipeById: (id) => `recipe/${id}`,
  editRecipeComment: (id) => `recipe/comment/${id}`,
  editReply: (id) => `recipe/reply/${id}`,
};
