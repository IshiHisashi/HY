import React from "react";

const SearchDrug = ({
  drug,
  setDrugName,
  setSearchedDrugId,
  searchedDrugId,
  setCompanyName,
  isNameSearchOpen,
  setIsNameSearchOpen,
}) => {
  const handleSelect = () => {
    setDrugName(drug.brand_name);
    setCompanyName(drug.company_name);
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
