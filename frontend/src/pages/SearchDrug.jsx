import React, { useReducer } from "react";

const SearchDrug = ({
  handleListClick,
  drug,
  setSearchedDrugId,
  searchedDrugId,
  isNameSearchOpen,
  setIsNameSearchOpen,
}) => {
  const handleSelect = () => {
    handleListClick("drugName", drug.brand_name);
    handleListClick("companyName", drug.company_name);
    setSearchedDrugId(drug.drug_code);
    setIsNameSearchOpen(false);
  };

  return (
    <li
      className="text-base text-gray-700 pl-3 py-[15px] hover:text-white hover:bg-primary-700"
      onClick={handleSelect}
    >
      {drug.brand_name}
    </li>
  );
};

export default SearchDrug;
