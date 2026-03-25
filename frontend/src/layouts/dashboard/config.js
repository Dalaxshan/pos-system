import Image from 'next/image';
import { useMemo } from 'react';
import { paths } from 'src/paths';

export const useSections = () => {
  return useMemo(() => {
    return [
      {
        items: [
          {
            title: 'Overview',
            path: paths.dashboard.index,
            icon: (
              <Image
                src="/assets/dashboard/home.svg"
                alt="Home Icon"
                width={19}
                height={19}
              />
            ),
          },
          {
            title: 'Items',

            path: paths.dashboard.item.index,
            icon: (
              <Image
                src="/assets/dashboard/items.svg"
                alt="Cube Icon"
                width={19}
                height={19}
              />
            ),
          },
          {
            title: 'Employees',

            path: paths.dashboard.employee.index,
            icon: (
              <Image
                src="/assets/dashboard/customers.svg"
                alt="Group of 5 people"
                width={19}
                height={19}
              />
            ),
          },
          {
            title: 'Recipe',
            path: paths.dashboard.recipe.index,
            icon: (
              <Image
                src="/assets/dashboard/menu.svg"
                alt="Recipe book"
                width={19}
                height={19}
              />
            ),
          },
        ],
      },

      {
        subheader: 'Invoice',

        items: [
          {
            title: 'Sales',
            path: paths.dashboard.sales.index,
            icon: (
              <Image
                src="/assets/dashboard/purchase_order.svg"
                alt="Stack of coins"
                width={19}
                height={19}
              />
            ),
          },
        ],
      },

      {
        subheader: 'Inventory',
        items: [
          {
            title: 'Purchase',
            path: paths.dashboard.purchase.index,
            icon: (
              <Image
                src="/assets/dashboard/orders.svg"
                alt="List"
                width={19}
                height={19}
              />
            ),
          },
          {
            title: 'Suppliers',
            path: paths.dashboard.supplier.index,
            icon: (
              <Image
                src="/assets/dashboard/supplier.svg"
                alt="2 People"
                width={19}
                height={19}
              />
            ),
          },
        ],
      },

      {
        subheader: 'Other',
        items: [
          {
            title: 'Dining setup',
            path: paths.dashboard.dining.index,
            icon: (
              <Image
                src="/assets/dashboard/dining.svg"
                alt="Dining table with 2 people"
                width={19}
                height={19}
              />
            ),
          },
          {
            title: 'Stocks',
            path: paths.dashboard.stock.index,
            icon: (
              <Image
                src="/assets/dashboard/stock.svg"
                alt="Rising Stock chart"
                width={19}
                height={19}
              />
            ),
          },
          {
            title: 'Settings',
            path: paths.dashboard.account,
            icon: (
              <Image
                src="/assets/dashboard/setting.svg"
                alt="Cogwheel"
                width={19}
                height={19}
              />
            ),
          },
        ],
      },
    ];
  }, []);
};
