import { useRef } from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import QRCode from 'react-qr-code';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const QrGenarator = (props) => {
  const { link } = props;
  const qrCodeRef = useRef();

  // Function to download the QR code as PDF
  const downloadPdf = async () => {
    const qrCodeElement = qrCodeRef.current;
    const canvas = await html2canvas(qrCodeElement);
    const pdf = new jsPDF();

    // Convert canvas to image data URL and add to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 80, 50, 60, 60);

    // Save the PDF with a filename
    pdf.save('qr-code.pdf');
  };

  return (
    <Card sx={{ maxWidth: 345, textAlign: 'center', padding: 2, margin: 'auto' }}>
      <CardContent>
        {/* Heading */}
        <Typography
          variant="h5"
          component="div"
          gutterBottom
        >
          SCAN MENU
        </Typography>
        <Box
          mt={2}
          ref={qrCodeRef}
        >
          {/* QR Code */}
          <QRCode
            value={link}
            size={128}
          />
        </Box>
        <Box mt={2}>
          {/* Download Button */}
          <Button
            variant="contained"
            onClick={downloadPdf}
          >
            Download as PDF
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
