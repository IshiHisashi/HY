import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import { userId } from "./App.js";

const DrugFile = ({}) => {
  const [drugs, setDrugs] = useState([]);
  // Read Drug Data
  useEffect(() => {
    if (userId && userId !== "logout") {
      axios.get("http://localhost:5555/drugs").then((res) => {
        setDrugs(res.data.data.drugs);
      });
    }
  }, [userId]);

  return (
    <Document>
      <Page size="A4">
        <Text>{`This is a test2 ${drugs[0]?._id}`}</Text>
      </Page>
    </Document>
  );
};

export default DrugFile;
