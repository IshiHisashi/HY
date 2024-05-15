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

const DrugFile = ({ drugs, userId }) => {
  // const [drugs, setDrugs] = useState([]);
  // Read Drug Data
  // useEffect(() => {
  //   if (userId && userId !== "logout") {
  //     axios.get("https://server.pillbook-hy.com/drugs").then((res) => {
  //       console.log(res);
  //       // setDrugs(res.data.data.drugs);
  //     });
  //   }
  // }, [userId]);

  const styles = StyleSheet.create({
    page: {
      flexDirextion: "row",
      backgroundColor: "#E4E4E4",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    title: {
      fontSize: 40,
      margin: 10,
      padding: 10,
      textAlign: "center",
    },
    title_2: {
      fontSize: 30,
      margin: 10,
      padding: 10,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Your Pill Book</Text>
        {drugs.map((drug) => (
          <View style={styles.section} key={drug._id}>
            <Text>{`Medication Name : ${drug?.drugName}`}</Text>
            <Text>{`Manufacturer : ${drug.companyName || "-"}`}</Text>
            <Text>{`Start Date : ${drug.takein.startDate || "-"}`}</Text>
            <Text>{`End Date : ${drug.takein.endDate || "-"}`}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default DrugFile;
