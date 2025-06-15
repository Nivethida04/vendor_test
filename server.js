import express from 'express';
import axios from 'axios';
import base64 from 'base-64';
import xml2js from 'xml2js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

import cors from 'cors';
app.use(cors());

// 🔐 SOAP credentials
const rfc_username = "K901499";
const rfc_password = "Kaar@nive499";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//LOGIN 
app.post('/login', async (req, res) => {
  const { customerId, password } = req.body;

  // Validate input
  if (!customerId || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  const formattedCustomerId = customerId.padStart(10, '0');

  const soapUrl = "http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zws_cust_1login?sap-client=100";

  // 🔧 Create SOAP XML
  const soapXml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZFM_CUST_LOGIN1>
          <I_CUSTID>${formattedCustomerId}</I_CUSTID>
          <I_CUSTPASS>${password}</I_CUSTPASS>
        </urn:ZFM_CUST_LOGIN1>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(soapUrl, soapXml, {
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + base64.encode(`${rfc_username}:${rfc_password}`)
      }
    });

    // ✅ Parse the XML response
    xml2js.parseString(response.data, { tagNameProcessors: [xml2js.processors.stripPrefix] }, (err, result) => {
  if (err) {
    return res.status(500).json({ error: "Error parsing SOAP response" });
  }

  console.log("Stripped Namespace SOAP Response:", JSON.stringify(result, null, 2));

  try {
    const responseBody = result['Envelope']['Body'][0];
    const loginResponse = responseBody['ZFM_CUST_LOGIN1Response'][0];
    const returnMessage = loginResponse['RETURN'][0];

    return res.json({ message: returnMessage , customerId: formattedCustomerId});
  } catch (parseError) {
    return res.status(500).json({ error: "Unexpected SOAP response format" });
  }
});

  } catch (error) {
    console.error("SOAP Request Failed:", error.message);
    return res.status(500).json({
      error: "SOAP request failed",
      details: error.message
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Profile Route
app.post('/profile', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Missing customer ID" });
  }

  const formattedCustomerId = customerId.padStart(10, '0');

  const soapUrl = "http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zws_cust_profile?sap-client=100";

  const soapXml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZFM_CUST_PROFILE>
          <I_CUSTID>${formattedCustomerId}</I_CUSTID>
        </urn:ZFM_CUST_PROFILE>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(soapUrl, soapXml, {
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + base64.encode(`${rfc_username}:${rfc_password}`)
      }
    });

    xml2js.parseString(response.data, { tagNameProcessors: [xml2js.processors.stripPrefix] }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing SOAP response" });
      }

      try {
        const responseBody = result['Envelope']['Body'][0];
        const profileResponse = responseBody['ZFM_CUST_PROFILEResponse'][0];
        const customerProfile = profileResponse['ES_OUT'][0];

        return res.json({
          customerId: customerProfile.KUNNR[0],
          name: customerProfile.NAME1[0],
          city: customerProfile.ORT01[0],
          postalCode: customerProfile.PSTLZ[0],
          shortName: customerProfile.SORTL[0],
          addressNumber: customerProfile.ADDRNUMBER[0],
          dateFrom: customerProfile.DATE_FROM[0],
          dateTo: customerProfile.DATE_TO[0]
        });
      } catch (parseError) {
        return res.status(500).json({ error: "Unexpected SOAP response format" });
      }
    });

  } catch (error) {
    console.error("SOAP Request Failed:", error.message);
    return res.status(500).json({
      error: "SOAP request failed",
      details: error.message
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Inquiry Route
app.post('/inquiry', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Missing customer ID" });
  }

  const formattedCustomerId = customerId.padStart(10, '0');

  const soapUrl = "http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zws_cust_inquiry?sap-client=100";

  const soapXml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZFM_CUST_INQUIRY>
          <I_CUSTID>${formattedCustomerId}</I_CUSTID>
        </urn:ZFM_CUST_INQUIRY>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(soapUrl, soapXml, {
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + base64.encode(`${rfc_username}:${rfc_password}`)
      }
    });

    xml2js.parseString(response.data, { tagNameProcessors: [xml2js.processors.stripPrefix] }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing SOAP response" });
      }

      try {
        const responseBody = result['Envelope']['Body'][0];
        const inquiryResponse = responseBody['ZFM_CUST_INQUIRYResponse'][0];
        const inquiryList = inquiryResponse['ET_INQUIRY'];

        if (!inquiryList || !inquiryList[0] || !inquiryList[0]['item']) {
          return res.json({ inquiries: [] }); // No data case
        }

        const formattedInquiries = inquiryList[0]['item'].map(entry => {
          const formattedEntry = {};
          for (const key in entry) {
            formattedEntry[key] = entry[key][0];
          }
          return formattedEntry;
        });

        return res.json({ inquiries: formattedInquiries });

      } catch (parseError) {
        return res.status(500).json({ error: "Unexpected SOAP response format" });
      }
    });

  } catch (error) {
    console.error("SOAP Request Failed:", error.message);
    return res.status(500).json({
      error: "SOAP request failed",
      details: error.message
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sales Route
app.post('/sales', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Missing customer ID" });
  }

  const formattedCustomerId = customerId.padStart(10, '0');

  const soapUrl = "http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zws_cust_sales?sap-client=100";

  const soapXml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZFM_CUST_1SALES>
          <I_CUSTID>${formattedCustomerId}</I_CUSTID>
        </urn:ZFM_CUST_1SALES>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(soapUrl, soapXml, {
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + base64.encode(`${rfc_username}:${rfc_password}`)
      }
    });

    xml2js.parseString(response.data, { tagNameProcessors: [xml2js.processors.stripPrefix] }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing SOAP response" });
      }

      try {
        const responseBody = result['Envelope']['Body'][0];
        const salesResponse = responseBody['ZFM_CUST_1SALESResponse'][0];
        const salesList = salesResponse['ET_SOD'];

        if (!salesList || !salesList[0] || !salesList[0]['item']) {
          return res.json({ sales: [] }); // No data case
        }

        const formattedSales = salesList[0]['item'].map(entry => {
          const formattedEntry = {};
          for (const key in entry) {
            formattedEntry[key] = entry[key][0];
          }
          return formattedEntry;
        });

        return res.json({ sales: formattedSales });

      } catch (parseError) {
        return res.status(500).json({ error: "Unexpected SOAP response format" });
      }
    });

  } catch (error) {
    console.error("SOAP Request Failed:", error.message);
    return res.status(500).json({
      error: "SOAP request failed",
      details: error.message
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Deliveries Route
app.post('/deliveries', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Missing customer ID" });
  }

  const formattedCustomerId = customerId.padStart(10, '0');

  const soapUrl = "http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zws_cust_lod?sap-client=100";

  const soapXml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZFM_CUST_LOD>
          <I_CUSTID>${formattedCustomerId}</I_CUSTID>
        </urn:ZFM_CUST_LOD>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(soapUrl, soapXml, {
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + base64.encode(`${rfc_username}:${rfc_password}`)
      }
    });

    xml2js.parseString(response.data, { tagNameProcessors: [xml2js.processors.stripPrefix] }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing SOAP response" });
      }

      try {
        const responseBody = result['Envelope']['Body'][0];
        const deliveriesResponse = responseBody['ZFM_CUST_LODResponse'][0];
        const deliveryList = deliveriesResponse['ET_LOD'];

        if (!deliveryList || !deliveryList[0] || !deliveryList[0]['item']) {
          return res.json({ deliveries: [] }); // No data case
        }

        const formattedDeliveries = deliveryList[0]['item'].map(entry => {
          const formattedEntry = {};
          for (const key in entry) {
            formattedEntry[key] = entry[key][0];
          }
          return formattedEntry;
        });

        return res.json({ deliveries: formattedDeliveries });

      } catch (parseError) {
        return res.status(500).json({ error: "Unexpected SOAP response format" });
      }
    });

  } catch (error) {
    console.error("SOAP Request Failed:", error.message);
    return res.status(500).json({
      error: "SOAP request failed",
      details: error.message
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/credit', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Missing customer ID" });
  }

  const formattedCustomerId = customerId.padStart(10, '0');

  const soapUrl = "	http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zws_cust_credit?sap-client=100";

  const soapXml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZFM_CUST_1CREDIT>
          <I_CUSTID>${formattedCustomerId}</I_CUSTID>
        </urn:ZFM_CUST_1CREDIT>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(soapUrl, soapXml, {
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + base64.encode(`${rfc_username}:${rfc_password}`)
      }
    });

    xml2js.parseString(response.data, { tagNameProcessors: [xml2js.processors.stripPrefix] }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing SOAP response" });
      }

      try {
        const responseBody = result['Envelope']['Body'][0];
        const creditResponse = responseBody['ZFM_CUST_1CREDITResponse'][0];
        const creditList = creditResponse['ET_CREDIT'];

        if (!creditList || !creditList[0] || !creditList[0]['item']) {
          return res.json({ credits: [] }); // No credit data
        }

        const formattedCredits = creditList[0]['item'].map(entry => {
          const formattedEntry = {};
          for (const key in entry) {
            formattedEntry[key] = entry[key][0];
          }
          return formattedEntry;
        });

        return res.json({ credits: formattedCredits });

      } catch (parseError) {
        return res.status(500).json({ error: "Unexpected SOAP response format" });
      }
    });

  } catch (error) {
    console.error("SOAP Request Failed:", error.message);
    return res.status(500).json({
      error: "SOAP request failed",
      details: error.message
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/debits', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Missing customer ID" });
  }

  const formattedCustomerId = customerId.padStart(10, '0');

  const soapUrl = "http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zws_cust_debit?sap-client=100";

  const soapXml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZFM_CUST_1DEBIT>
          <I_CUSTID>${formattedCustomerId}</I_CUSTID>
        </urn:ZFM_CUST_1DEBIT>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(soapUrl, soapXml, {
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + base64.encode(`${rfc_username}:${rfc_password}`)
      }
    });

    xml2js.parseString(response.data, { tagNameProcessors: [xml2js.processors.stripPrefix] }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing SOAP response" });
      }

      try {
        const responseBody = result['Envelope']['Body'][0];
        const debitResponse = responseBody['ZFM_CUST_1DEBITResponse'][0];
        const debitList = debitResponse['ET_DEBIT'];

        if (!debitList || !debitList[0] || !debitList[0]['item']) {
          return res.json({ debits: [] }); // No data case
        }

        const formattedDebits = debitList[0]['item'].map(entry => {
          const formattedEntry = {};
          for (const key in entry) {
            formattedEntry[key] = entry[key][0];
          }
          return formattedEntry;
        });

        return res.json({ debits: formattedDebits });

      } catch (parseError) {
        return res.status(500).json({ error: "Unexpected SOAP response format" });
      }
    });

  } catch (error) {
    console.error("SOAP Request Failed:", error.message);
    return res.status(500).json({
      error: "SOAP request failed",
      details: error.message
    });
  }
});
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/payage', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Missing customer ID" });
  }

  const formattedCustomerId = customerId.padStart(10, '0');

  const soapUrl = "http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zws_payage?sap-client=100";

  const soapXml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZFM_CUST_PAYAGE>
          <I_CUSTID>${formattedCustomerId}</I_CUSTID>
        </urn:ZFM_CUST_PAYAGE>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(soapUrl, soapXml, {
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + base64.encode(`${rfc_username}:${rfc_password}`)
      }
    });

    xml2js.parseString(response.data, { tagNameProcessors: [xml2js.processors.stripPrefix] }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing SOAP response" });
      }

      try {
        const responseBody = result['Envelope']['Body'][0];
        const payageResponse = responseBody['ZFM_CUST_PAYAGEResponse'][0];
        const agingList = payageResponse['IT_AGING'];

        if (!agingList || !agingList[0] || !agingList[0]['item']) {
          return res.json({ payage: [] }); // No PAYAGE data
        }

        const formattedPayage = agingList[0]['item'].map(entry => {
          const formattedEntry = {};
          for (const key in entry) {
            formattedEntry[key] = entry[key][0];
          }
          return formattedEntry;
        });

        return res.json({ payage: formattedPayage });

      } catch (parseError) {
        return res.status(500).json({ error: "Unexpected SOAP response format" });
      }
    });

  } catch (error) {
    console.error("SOAP Request Failed:", error.message);
    return res.status(500).json({
      error: "SOAP request failed",
      details: error.message
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/invoicedata', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Missing customer ID" });
  }

  const formattedCustomerId = customerId.padStart(10, '0');

  const soapUrl = "http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zws_cust_test_data?sap-client=100";

  const soapXml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZFM_CUST_2INVOICE>
          <I_CUSTID>${formattedCustomerId}</I_CUSTID>
        </urn:ZFM_CUST_2INVOICE>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(soapUrl, soapXml, {
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + base64.encode(`${rfc_username}:${rfc_password}`)
      }
    });

    xml2js.parseString(response.data, { tagNameProcessors: [xml2js.processors.stripPrefix] }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing SOAP response" });
      }

      try {
        const responseBody = result['Envelope']['Body'][0];
        const payageResponse = responseBody['ZFM_CUST_2INVOICEResponse'][0];
        const invoice = payageResponse['E_INVOICE'];

        if (!invoice || !invoice[0] || !invoice[0]['item']) {
          return res.json({ payage: [] }); // No PAYAGE data
        }

        const formattedinvoice = invoice[0]['item'].map(entry => {
          const formattedEntry = {};
          for (const key in entry) {
            formattedEntry[key] = entry[key][0];
          }
          return formattedEntry;
        });

        return res.json({ invoice_data : formattedinvoice });

      } catch (parseError) {
        return res.status(500).json({ error: "Unexpected SOAP response format" });
      }
    });

  } catch (error) {
    console.error("SOAP Request Failed:", error.message);
    return res.status(500).json({
      error: "SOAP request failed",
      details: error.message
    });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/invoice', async (req, res) => {
  const {  invoiceNumber,itemnumber } = req.body;

  if (!itemnumber  || !invoiceNumber) {
    return res.status(400).json({ error: "Missing customer ID or invoice number" });
  }

  const formattedInvoiceNumber = invoiceNumber.padStart(8, '0');
    const formattedItemnumber = itemnumber.padStart(10, '0');

  const soapUrl = "http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zws_cust_test?sap-client=100";

  const soapXml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZFM_CUST_TEST>
          <P_KUNNR>${formattedItemnumber}</P_KUNNR>
          <P_VBELN>${formattedInvoiceNumber}</P_VBELN>
        </urn:ZFM_CUST_TEST>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(soapUrl, soapXml, {
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + base64.encode(`${rfc_username}:${rfc_password}`)
      }
    });

    xml2js.parseString(response.data, { tagNameProcessors: [xml2js.processors.stripPrefix] }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing SOAP response" });
      }

      try {
        const responseBody = result['Envelope']['Body'][0];
        const invoiceResponse = responseBody['ZFM_CUST_TESTResponse'][0];
        const pdfBase64 = invoiceResponse['IT_STRING']?.[0];

        if (!pdfBase64) {
          return res.status(404).json({ error: "No PDF data returned" });
        }

        const buffer = Buffer.from(pdfBase64, 'base64');

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=invoice_${formattedInvoiceNumber}.pdf`,
          'Content-Length': buffer.length
        });

        return res.send(buffer);

      } catch (parseError) {
        return res.status(500).json({ error: "Unexpected SOAP response format" });
      }
    });

  } catch (error) {
    console.error("SOAP Request Failed:", error.message);
    return res.status(500).json({
      error: "SOAP request failed",
      details: error.message
    });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/overall', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Missing customer ID" });
  }

  const formattedCustomerId = customerId.padStart(10, '0');

  const soapUrl = "http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zws_cust_overall?sap-client=100";

  const soapXml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZFM_CUST_OVERALLDATA>
          <I_CUSTID>${formattedCustomerId}</I_CUSTID>
        </urn:ZFM_CUST_OVERALLDATA>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(soapUrl, soapXml, {
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + base64.encode(`${rfc_username}:${rfc_password}`)
      }
    });

    xml2js.parseString(response.data, { tagNameProcessors: [xml2js.processors.stripPrefix] }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing SOAP response" });
      }

      try {
        const responseBody = result['Envelope']['Body'][0];
        const payageResponse = responseBody['ZFM_CUST_OVERALLDATAResponse'][0];
        const agingList = payageResponse['E_OVERALL'];

        if (!agingList || !agingList[0] || !agingList[0]['item']) {
          return res.json({ payage: [] }); // No PAYAGE data
        }

        const formattedPayage = agingList[0]['item'].map(entry => {
          const formattedEntry = {};
          for (const key in entry) {
            formattedEntry[key] = entry[key][0];
          }
          return formattedEntry;
        });

        return res.json({ overall: formattedPayage });

      } catch (parseError) {
        return res.status(500).json({ error: "Unexpected SOAP response format" });
      }
    });

  } catch (error) {
    console.error("SOAP Request Failed:", error.message);
    return res.status(500).json({
      error: "SOAP request failed",
      details: error.message
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
