import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useTheme } from '@mui/material/styles';

import { formatPrice } from 'src/utils/price-format';
import { formatDateTime } from 'src/utils/format-date-time';

const useStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    page: {
      backgroundColor: '#FFFFFF',
      padding: 8,
      width: '80mm',
    },
    header: {
      marginBottom: 16,
      textAlign: 'center',
    },
    h6: {
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.6,
    },
    subtitle2: {
      fontSize: 8,
      fontWeight: 500,
      lineHeight: 1.57,
    },
    subtitle3: {
      fontSize: 8,
      fontWeight: 1000,
      lineHeight: 1.57,
    },
    body2: {
      fontSize: 8,
      fontWeight: 400,
      lineHeight: 1.43,
    },
    body3: {
      fontSize: 8,
      fontWeight: 30,
      lineHeight: 1.43,
    },
    boldText: {
      fontWeight: 'bold',
    },
    coloredText: {
      color: 'gray',
    },
    billing: {
      marginTop: 8,
    },
    items: {
      marginTop: 16,
    },
    itemRow: {
      borderBottomWidth: 1,
      borderColor: '#EEEEEE',
      borderStyle: 'solid',
      flexDirection: 'row',
    },
    itemNumber: {
      padding: 4,
      width: '10%',
    },
    itemDescription: {
      padding: 4,
      width: '50%',
    },
    itemQty: {
      padding: 4,
      width: '10%',
    },
    itemTotalAmount: {
      padding: 4,
      width: '30%',
      textAlign: 'right',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
    },
    summaryTitle: {
      padding: 0,
      width: '40%',
    },
    summaryValue: {
      padding: 0,
      width: '30%',
      textAlign: 'right',
    },
    footer: {
      marginTop: 16,
      textAlign: 'center',
    },
    dashedDivider: {
      borderTop: '1px dashed gray',
      marginTop: 1,
      marginBottom: 5,
    },
  });
};

export const InvoicePdfDocument = (props) => {
  const { purchase } = props;
  const styles = useStyles();

  return (
    <Document>
      <Page
        size="A7"
        style={styles.page}
        wrap={false}
      >
        <View style={styles.header}>
          <Text style={styles.h6}>Welcome to MAKI POS System</Text>
          <Text style={styles.body2}>No 3, Rathnamalana</Text>
          <Text style={styles.body2}>Colombo, Sri Lanka</Text>
          <Text style={styles.body2}>accounts@possystem.com</Text>
          <Text style={styles.body2}>011 111 2222</Text>
        </View>
        <View>
          <Text style={[styles.subtitle3, styles.body3]}>
            <Text style={styles.boldText}>Invoice No:</Text> {purchase.orderId}
          </Text>
          <Text style={[styles.subtitle2, styles.body2, styles.coloredText]}>
            <Text style={styles.boldText}>Date/Time:</Text> {formatDateTime(purchase.createdAt)}
          </Text>
          {/* <Text style={[styles.subtitle2, styles.body2, styles.coloredText]}>
            <Text style={styles.boldText}>Billed to:</Text> {purchase?.customerName}
          </Text>
          <Text style={[styles.subtitle2, styles.body2, styles.coloredText]}>
           {purchase?.contactNo}
          </Text> */}

          {purchase?.tableId ? (
            <Text style={[styles.subtitle2, styles.body2, styles.coloredText]}>
              <Text style={styles.boldText}>Table No:</Text> {purchase?.tableId?.tableName || ''}
            </Text>
          ) : (
            <Text style={[styles.subtitle2, styles.body2, styles.coloredText]}>
              <Text style={styles.boldText}>Order Type:</Text> {purchase?.serviceStatus || ''}
            </Text>
          )}
        </View>
        <View style={styles.billing}>
          <View style={styles.dashedDivider} />
        </View>

        <View style={styles.items}>
          <View style={styles.itemRow}>
            <View style={styles.itemNumber}>
              <Text style={styles.body2}>#</Text>
            </View>
            <View style={styles.itemDescription}>
              <Text style={styles.body2}>Items</Text>
            </View>
            <View style={styles.itemQty}>
              <Text style={styles.body2}>Qty</Text>
            </View>
            <View style={styles.itemTotalAmount}>
              <Text style={styles.body2}>Total</Text>
            </View>
          </View>
          {purchase.items?.map((item, index) => (
            <View
              key={item._id}
              style={styles.itemRow}
            >
              <View style={styles.itemNumber}>
                <Text style={[styles.body2, styles.coloredText]}>{index + 1}</Text>
              </View>
              <View style={styles.itemDescription}>
                <Text style={[styles.body2, styles.coloredText]}>{item.itemName}</Text>
              </View>
              <View style={styles.itemQty}>
                <Text style={[styles.body2, styles.coloredText]}>{item.quantity}</Text>
              </View>
              <View style={styles.itemTotalAmount}>
                <Text style={[styles.body2, styles.coloredText]}>
                  {formatPrice(item.totalPriceItem)}
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryTitle, styles.coloredText]}>
              <Text style={styles.body2}>Subtotal</Text>
            </View>
            <View style={styles.summaryValue}>
              <Text style={[styles.body2, styles.coloredText]}>
                {formatPrice(purchase.subTotal)}
              </Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryTitle, styles.coloredText]}>
              <Text style={styles.body2}>Discount</Text>
            </View>
            <View style={styles.summaryValue}>
              <Text style={[styles.body2, styles.coloredText]}>{purchase.discount} %</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryTitle, styles.coloredText]}>
              <Text style={[styles.body2, styles.coloredText]}>Service Charge</Text>
            </View>
            <View style={styles.summaryValue}>
              <Text style={[styles.body2, styles.coloredText]}>
                {formatPrice(purchase.serviceCharge)}
              </Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryTitle]}>
              <Text style={styles.body2}>Total</Text>
            </View>
            <View style={styles.summaryValue}>
              <Text style={styles.body2}>{formatPrice(purchase.grandTotal)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.dashedDivider} />
        </View>

        <View>
          <Text style={[styles.subtitle3, styles.body3]}>
            <Text style={styles.boldText}>Cashier:</Text> {purchase?.employeeId?.name} (
            {purchase?.employeeId?.employeeId})
          </Text>
        </View>

        <View style={[styles.footer, styles.coloredText]}>
          <Text style={styles.body2}>Thank you!</Text>
        </View>
      </Page>
    </Document>
  );
};

InvoicePdfDocument.propTypes = {
  purchase: PropTypes.object.isRequired,
};
