import Image from 'next/image';
import { useMemo } from 'react';
import { paths } from 'src/paths';

export const useSections = () => {
  return useMemo(() => {
    return [
      {
        subheader: 'Items',

        items: [
          {
            title: 'Items',

            path: paths.chef.item.index,
            icon: (
              <Image
                src="/assets/dashboard/items.svg"
                alt="Cube"
                width={19}
                height={19}
              />
            ),
          },
          {
            title: 'Recipe',
            path: paths.chef.recipe.index,
            icon: (
              <Image
                src="/assets/dashboard/menu.svg"
                alt="Menu"
                width={19}
                height={19}
              />
            ),
          },
        ],
      },
      {
        subheader: 'Orders',
        items: [
          {
            title: 'Orders',
            path: paths.chef.orders.index,
            icon: (
              <Image
                src="/assets/dashboard/orders.svg"
                alt="Book with list"
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
            title: 'Settings',
            path: paths.chef.account,
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
