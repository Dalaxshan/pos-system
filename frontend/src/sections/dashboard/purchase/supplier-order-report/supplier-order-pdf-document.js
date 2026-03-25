import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useTheme } from '@mui/material/styles';
import { formatDate } from 'src/utils/form-date';
import { formatPrice } from 'src/utils/price-format';

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
        alignItems: 'center',
        marginBottom: 12,
      },
      brand: {
        height: 40,
        width: 90,
      },
      company: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 22,
        alignItems: 'flex-start',
      },
      references: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        alignItems: 'flex-start',
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
        justifyContent: 'space-between',
      },
      itemNumber: {
        padding: 6,
        width: '10%',
      },
      itemDescription: {
        padding: 6,
        width: '50%',
      },
      itemQty: {
        padding: 6,
        width: '10%',
        textAlign: 'center',
      },
      itemUnitAmount: {
        padding: 6,
        width: '15%',
        textAlign: 'right',
      },
      itemTotalAmount: {
        padding: 6,
        width: '15%',
        textAlign: 'right',
      },
      summaryRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
        alignItems: 'center',
      },
      summaryTitle: {
        padding: 6,
        width: '15%',
        textAlign: 'right',
      },
      summaryValue: {
        padding: 6,
        width: '25%',
        textAlign: 'right',
      },
      notes: {
        marginTop: 32,
      },
    });
  }, [theme]);
};

export const InvoicePdfDocument = (props) => {
  const { purchase } = props;
  const styles = useStyles();

  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        <View style={styles.header}>
          <Image
            src="/assets/maki-pos-black-transparent.png"
            style={styles.brand}
            alt="maki-pos-logo"
          />
          <View>
            <Text style={styles.subtitle2}>{purchase.orderId}</Text>
          </View>
        </View>
        <View style={styles.company}>
          <View>
            <Text style={styles.body2}>No 3, Rathnamalana</Text>
            <Text style={styles.body2}>Colombo</Text>
            <Text style={styles.body2}>Sri Lanka</Text>
          </View>

          <View>
            <Text style={styles.body2}>accounts@possystem.com</Text>
            <Text style={styles.body2}>011 111 2222</Text>
          </View>
        </View>
        <View style={styles.references}>
          <View>
            <Text style={[styles.subtitle2, styles.gutterBottom]}>Date of Issue</Text>
            <Text style={styles.body2}>{formatDate(purchase.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.billing}>
          <Text style={[styles.subtitle2, styles.gutterBottom]}>Billed to</Text>
          <Text style={styles.body2}>{purchase?.supplierId?.companyName}</Text>
          <Text style={styles.body2}>{purchase?.supplierId?.contactNumber}</Text>
          <Text style={styles.body2}>{purchase?.supplierId?.address}</Text>
        </View>
        <View style={styles.items}>
          <View style={styles.itemRow}>
            <View style={styles.itemNumber}>
              <Text style={styles.h6}>#</Text>
            </View>
            <View style={styles.itemDescription}>
              <Text style={styles.h6}>Items</Text>
            </View>
            <View style={styles.itemQty}>
              <Text style={styles.h6}>Qty</Text>
            </View>
            <View style={styles.itemUnitAmount}>
              <Text style={[styles.h6, styles.alignRight]}>Unit Price</Text>
            </View>
            <View style={styles.itemUnitAmount}>
              <Text style={[styles.h6, styles.alignRight]}>Discount</Text>
            </View>
            <View style={styles.itemTotalAmount}>
              <Text style={[styles.h6, styles.alignRight]}>Net Total</Text>
            </View>
          </View>

          {purchase.items?.map((item, index) => (
            <View
              key={'0090'}
              style={styles.itemRow}
            >
              <View style={styles.itemNumber}>
                <Text style={styles.body2}>{index + 1}</Text>
              </View>
              <View style={styles.itemDescription}>
                <Text style={styles.body2}>{item.itemName}</Text>
              </View>
              <View style={styles.itemQty}>
                <Text style={styles.body2}>{item?.quantity?.value}</Text>
              </View>
              <View style={styles.itemUnitAmount}>
                <Text style={[styles.body2, styles.alignRight]}>{formatPrice(item.unitPrice)}</Text>
              </View>
              <View style={styles.itemUnitAmount}>
                <Text style={[styles.body2, styles.alignRight]}>{item.discount || 0}%</Text>
              </View>
              <View style={styles.itemTotalAmount}>
                <Text style={[styles.body2, styles.alignRight]}>
                  {formatPrice(item.totalPriceItem)}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.summaryRow}>
            <View style={styles.summaryTitle}>
              <Text style={styles.body2}>Subtotal</Text>
            </View>
            <View style={styles.summaryValue}>
              <Text style={styles.body2}>{formatPrice(purchase.grossPrice)}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryTitle}>
              <Text style={styles.body2}>Discount</Text>
            </View>
            <View style={styles.summaryValue}>
              <Text style={styles.body2}>{purchase.discount}%</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryTitle}>
              <Text style={styles.body2}>Total</Text>
            </View>
            <View style={styles.summaryValue}>
              <Text style={styles.body2}>{formatPrice(purchase.netPrice)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

InvoicePdfDocument.propTypes = {
  invoice: PropTypes.object.isRequired,
};
