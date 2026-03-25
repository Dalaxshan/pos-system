import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useTheme } from '@mui/material/styles';

const useStyles = () => {
  const theme = useTheme();

  return useMemo(() => {
    return StyleSheet.create({
      page: {
        backgroundColor: '#FFFFFF',
        padding: 24,
      },
      h4: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.235,
      },
      h6: {
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.6,
      },
      alignRight: {
        textAlign: 'right',
      },
      subtitle2: {
        fontSize: 10,
        fontWeight: 500,
        lineHeight: 1.57,
      },
      body2: {
        fontSize: 10,
        fontWeight: 400,
        lineHeight: 1.43,
      },
      gutterBottom: {
        marginBottom: 4,
      },
      colorSuccess: {
        color: theme.palette.success.main,
      },
      uppercase: {
        textTransform: 'uppercase',
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      brand: {
        height: 140,
        width: 140,
      },
      company: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
      },
      references: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
      },
      billing: {
        marginTop: 32,
      },
      items: {
        marginTop: 32,
      },
      itemRow: {
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
        borderStyle: 'solid',
        flexDirection: 'row',
      },
      itemNumber: {
        padding: 6,
        width: '10%',
      },
      item: {
        padding: 6,
        width: '30%',
      },
      itemCategory: {
        padding: 6,
        width: '20%',
      },
      itemQty: {
        padding: 6,
        width: '10%',
      },
      itemPrice: {
        padding: 6,
        width: '15%',
      },
      itemDiscount: {
        padding: 6,
        width: '15%',
      },
      itemTotalAmount: {
        padding: 6,
        width: '15%',
      },
      summaryRow: {
        flexDirection: 'row',
      },
      summaryGap: {
        padding: 6,
        width: '70%',
      },
      summaryTitle: {
        padding: 6,
        width: '15%',
      },
      summaryValue: {
        padding: 6,
        width: '15%',
      },
      notes: {
        marginTop: 5,
      },

      divider: {
        borderBottomWidth: 1,
        borderColor: '#000000',
        borderStyle: 'solid',
        marginVertical: 16,
      },
    });
  }, [theme]);
};

export const InvoicePdfDocument = (props) => {
  const { invoice } = props;
  const styles = useStyles();

  const items = invoice.items || [];
  const dueDate = invoice.dueDate && format(invoice.dueDate, 'dd MMM yyyy');
  const issueDate = invoice.issueDate && format(invoice.issueDate, 'dd MMM yyyy');
  const subtotalAmount = numeral(invoice.subtotalAmount).format(`${invoice.currency}0,0.00`);
  const discount = numeral(invoice.discount).format(`${invoice.currency}0,0.00`);
  const totalAmount = numeral(invoice.totalAmount).format(`${invoice.currency}0,0.00`);
  const orderDiscount = numeral(invoice.orderDiscount).format(`${invoice.currency}0,0.00`);

  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        <View style={styles.header}>
          <View>
            <Image
              src="/assets/maki-pos.webp"
              style={styles.brand}
              alt="Maki POS logo"
            />
            <Text style={styles.h6}>Maki POS System</Text>
          </View>
          <View>
            <Text style={[styles.h4, styles.uppercase, styles.colorSuccess]}>{invoice.status}</Text>
            <Text style={styles.subtitle2}>{invoice.number}</Text>
          </View>
        </View>
        <View style={styles.company}>
          <View>
            <Text style={styles.body2}>No 3, Rathnamalana</Text>
            <Text style={styles.body2}>Colombo</Text>
            <Text style={styles.body2}>Srilanka</Text>
          </View>
          <View>
            <Text style={styles.body2}>Company No. 4675933</Text>
            <Text style={styles.body2}>EU VAT No. 949 67545 45</Text>
          </View>
          <View>
            <Text style={styles.body2}>accounts@devias.io</Text>
            <Text style={styles.body2}>(+40) 652 3456 23</Text>
          </View>
        </View>
        <View style={styles.references}>
          <View>
            <Text style={[styles.subtitle2, styles.gutterBottom]}>Due Date</Text>
            <Text style={styles.body2}>{dueDate}</Text>
          </View>
          <View>
            <Text style={[styles.subtitle2, styles.gutterBottom]}>Date of issue</Text>
            <Text style={styles.body2}>{issueDate}</Text>
          </View>
          <View>
            <Text style={[styles.subtitle2, styles.gutterBottom]}>Number</Text>
            <Text style={styles.body2}>{invoice.number}</Text>
          </View>
        </View>
        {/* <View style={styles.billing}>
          <Text style={[styles.subtitle2, styles.gutterBottom]}>Billed to</Text>
          <Text style={styles.body2}>{invoice.customer.name}</Text>
          <Text style={styles.body2}>{invoice.customer.taxId}</Text>
          <Text style={styles.body2}>{invoice.customer.address}</Text>
        </View> */}
        <View style={styles.items}>
          <View style={styles.itemRow}>
            <View style={styles.itemNumber}>
              <Text style={styles.h6}>#</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.h6}>Item</Text>
            </View>
            <View style={styles.itemCategory}>
              <Text style={styles.h6}>Category</Text>
            </View>
            <View style={styles.itemQty}>
              <Text style={styles.h6}>Qty</Text>
            </View>
            <View style={styles.itemPrice}>
              <Text style={styles.h6}>Unit price</Text>
            </View>
            <View style={styles.itemDiscount}>
              <Text style={styles.h6}>Discount</Text>
            </View>
            <View style={styles.itemTotalAmount}>
              <Text style={[styles.h6, styles.alignRight]}>Total</Text>
            </View>
          </View>
          {items.map((item, index) => {
            const price = numeral(item.price).format(`${item.currency}0,0.00`);
            const discount = numeral(item.discount).format(`${item.currency}0,0.00`);
            const totalAmount = numeral(item.totalAmount).format(`${item.currency}0,0.00`);

            return (
              <View
                key={item.id}
                style={styles.itemRow}
              >
                <View style={styles.itemNumber}>
                  <Text style={styles.body2}>{index + 1}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.body2}>{item.item}</Text>
                </View>
                <View style={styles.itemCategory}>
                  <Text style={styles.body2}>{item.category}</Text>
                </View>
                <View style={styles.itemQty}>
                  <Text style={styles.body2}>{item.quantity}</Text>
                </View>
                <View style={styles.itemPrice}>
                  <Text style={[styles.body2]}>{price}</Text>
                </View>
                <View style={styles.itemDiscount}>
                  <Text style={[styles.body2]}>{discount}</Text>
                </View>
                <View style={styles.itemTotalAmount}>
                  <Text style={[styles.body2, styles.alignRight]}>{totalAmount}</Text>
                </View>
              </View>
            );
          })}
          <View style={styles.summaryRow}>
            <View style={styles.summaryGap} />
            <View style={styles.summaryTitle}>
              <Text style={styles.body2}>Subtotal</Text>
            </View>
            <View style={styles.summaryValue}>
              <Text style={[styles.body2, styles.alignRight]}>{subtotalAmount}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryGap} />
            <View style={styles.summaryTitle}>
              <Text style={styles.body2}>Order discount</Text>
            </View>
            <View style={styles.summaryValue}>
              <Text style={[styles.body2, styles.alignRight]}>{orderDiscount}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryGap} />
            <View style={styles.summaryTitle}>
              <Text style={styles.body2}>Total</Text>
            </View>
            <View style={styles.summaryValue}>
              <Text style={[styles.subtitle2, styles.alignRight]}>{totalAmount}</Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />

        <View style={styles.notes}>
          <Text style={[styles.body2, styles.gutterBottom]}>Notes</Text>
          <Text style={styles.body2}>
            Please make sure you check our invoice before the due date.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

InvoicePdfDocument.propTypes = {
  invoice: PropTypes.object.isRequired,
};
