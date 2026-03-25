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
            path: paths.cashier.index,
            icon: (
              <Image
                src="/assets/dashboard/home.svg"
                alt="Home"
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
            path: paths.cashier.sales.index,
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
        subheader: 'Other',
        items: [
          {
            title: 'Settings',
            path: paths.cashier.account,
            icon: (
              <Image
                src="/assets/dashboard/setting.svg"
                alt="Wallet"
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
