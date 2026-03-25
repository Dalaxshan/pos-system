export const paths = {
  index: '/',
  register: '/register',
  loginIntegration: '/login-page-integration',
  loginIntegrationRole: '/login-page-integration?role=:Role',
  checkout: '/checkout',
  contact: '/contact',
  home: '/home',
  storyTime: '/story-time',
  bentoBox: '/bento-box',
  portfolio: '/portfolio',
  aboutUs: 'about-us',
  termsAndConditions: '/terms-and-conditions',
  cookiePolicy: '/cookie-policy',
  productLogin: '/product-login',
  login: '/login',
  blog: '/blog',
  menu: '/menu',
  allServices: {
    index: '/all-services',
    softwareDevelopment: '/all-services/software-development',
    uIUXDesign: '/all-services/ui-ux-design',
    qualityAssurance: '/all-services/quality-assurance',
  },
  auth: {
    auth0: {
      callback: '/auth/auth0/callback',
      login: '/auth/auth0/login',
    },
    jwt: {
      login: '/auth/jwt/login',
      register: '/auth/jwt/register',
    },
    firebase: {
      login: '/auth/firebase/login',
      register: '/auth/firebase/register',
    },
    amplify: {
      confirmRegister: '/auth/amplify/confirm-register',
      forgotPassword: '/auth/amplify/forgot-password',
      login: '/auth/amplify/login',
      register: '/auth/amplify/register',
      resetPassword: '/auth/amplify/reset-password',
    },
  },
  authDemo: {
    forgotPassword: {
      classic: '/auth-demo/forgot-password/classic',
      modern: '/auth-demo/forgot-password/modern',
    },
    login: {
      classic: '/auth-demo/login/classic',
      modern: '/auth-demo/login/modern',
    },
    register: {
      classic: '/auth-demo/register/classic',
      modern: '/auth-demo/register/modern',
    },
    resetPassword: {
      classic: '/auth-demo/reset-password/classic',
      modern: '/auth-demo/reset-password/modern',
    },
    verifyCode: {
      classic: '/auth-demo/verify-code/classic',
      modern: '/auth-demo/verify-code/modern',
    },
  },
  dashboard: {
    index: '/dashboard',
    heatmaps: '/dashboard/heatmaps',
    socialMediaData: '/dashboard/social-media-data',
    screenRecordings: '/dashboard/screen-recordings',
    account: '/dashboard/account',
    blank: '/dashboard/blank',
    mailRegister: '/dashboard/mail/register',
    mail: '/dashboard/mail',
    sushiPay: '/dashboard/sushi-pay',
    sushiPayRegister: '/dashboard/sushi-pay/register',
    settings: '/dashboard/account/settings',
    

    qrCode: {
      index: '/dashboard/qr-code',
    },

    dining: {
      index: '/dashboard/dining',
      createBranch: '/dashboard/dining/create-branch',
      createTable: '/dashboard/dining/:id/create-table',
    },

    supplier: {
      index: '/dashboard/supplier',
      createSupplier: '/dashboard/supplier/create-supplier',
      editSupplier: '/dashboard/supplier/:id/edit-supplier',
    },

    item: {
      index: '/dashboard/item',
      createItem: '/dashboard/item/create-item',
      editItem: '/dashboard/item/:id/edit-item',
      viewItem: '/dashboard/item/:id/item-detail',
    },

    purchase: {
      index: '/dashboard/purchase',
      createOrder: '/dashboard/purchase/create-purchase-order',
      purchaseOrder: '/dashboard/purchase/:id/purchase-order',
      editPurchase: '/dashboard/purchase/:id/edit-purchase-order',
      deletePurchase: '/dashboard/purchase/:id/delete-purchase-order',
      getPurchaseReceipt: '/dashboard/purchase/:id/purchase-receipt',
      getAggregatedAverageProfit: '/dashboard/overview/profit-average'
    },

    employee: {
      index: '/dashboard/employee',
      createEmployee: '/dashboard/employee/create-employee',
      editEmployee: '/dashboard/employee/:id/edit-employee',
    },

    sales: {
      index: '/dashboard/sales',
      createSales: '/dashboard/create-sale',
      getSalesReceipt: '/dashboard/sales/:id/sales-receipt',
      editOrder: '/dashboard/sales/:id/edit-order',
    },

    menu: {
      index: '/dashboard/menu',
      createMenu: '/dashboard/menu/create-menu',
      editMenu: '/dashboard/menu/edit-menu',
    },

    stock: {
      index: '/dashboard/stock',
      createStock: '/dashboard/stock/create-stock',
      editStock: '/dashboard/stock/:id/edit-stock',
    },
    recipe: {
      index: '/dashboard/recipe',
    },
  },

  cashier: {
    index: '/cashier',
    account: '/cashier/account',

    order: {
      index: '/cashier/order/index',
    },

    customer: {
      index: '/cashier/customer',
      createCustomer: '/cashier/customer/create-customer',
    },

    item: {
      index: '/cashier/item',
      createItem: '/cashier/item/create-item',
      viewItem: '/cashier/item/:id/item-detail',
    },

    sales: {
      index: '/cashier/sales',
      createSales: '/cashier/sales/create-sale',
      updateSale: '/cashier/sales/:id',
      getSalesReceipt: '/cashier/sales/:id/sales-receipt',
    },
  },

  chef: {
    index: '/chef/sales',
    account: '/chef/account',

    orders: {
      index: '/chef/orders',
      orderReceipt: '/chef/orders/:id/order-receipt',
    },

    item: {
      index: '/chef/item',
    },

    recipe: {
      index: '/chef/recipe',
    },
  },

  components: {
    index: '/components',
    dataDisplay: {
      detailLists: '/components/data-display/detail-lists',
      tables: '/components/data-display/tables',
      quickStats: '/components/data-display/quick-stats',
    },
    lists: {
      groupedLists: '/components/lists/grouped-lists',
      gridLists: '/components/lists/grid-lists',
    },
    forms: '/components/forms',
    modals: '/components/modals',
    charts: '/components/charts',
    buttons: '/components/buttons',
    typography: '/components/typography',
    colors: '/components/colors',
    inputs: '/components/inputs',
  },
  docs: 'https://material-kit-pro-react-docs.devias.io',
  notAuthorized: '/401',
  notFound: '/404',
  serverError: '/500',
};
