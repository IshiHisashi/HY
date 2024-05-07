import React from "react";
import { CgFileDocument } from "react-icons/cg";
import { HiOutlineDownload, HiOutlinePrinter } from "react-icons/hi";
import { FiShare2 } from "react-icons/fi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DrugFile from "./drugFile.js";
import { drugs } from "./pages/ViewDrug.jsx";

const PdfCard = ({ title, drugs }) => {
  const styles = {
    container: {
      width: "220px",
      borderRadius: "5px",
      padding: "15px 12px",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
    },
    flex: { width: "100%", display: "flex", gap: "5px", alignItems: "center" },
    bold: { fontSize: "13px", fontWeight: 600 },
    thin: { fontSize: "11px", color: "#6f6f6f", fontWeight: 500 },
    btn: {
      borderRadius: "3px",
      border: "1px solid gray",
      display: "flex",
      alignItems: "center",
      gap: "2px",
      padding: "3px",
      fontSize: "11px",
      color: "#4f4f4f",
      fontWeight: 600,
      cursor: "pointer",
      userSelect: "none",
    },
  };
  //   console.log(drugs);
  return (
    <>
      <PDFDownloadLink
        document={<DrugFile drugs={drugs} />}
        fileName="drug_file.pdf"
        className="absolute top-4 right-4 scale-150	"
      >
        {/* <div style={styles.btn}> */}
        <button>
          {" "}
          <HiOutlineDownload size={14} />
          {/* <span>Download</span> */}
        </button>
        {/* </div> */}
      </PDFDownloadLink>
    </>
  );
};

export default PdfCard;
