import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentURL = window.location.pathname;

  console.log(currentURL);
  return (
    <>
      <footer className="absolute bottom-0 bg-white w-full h-[83px] pt-2 px-[42px] flex justify-between">
        <div className="schedule">
          {currentURL === "/" ? (
            <>
              <div className="flex flex-col gap-[5px] cursor-pointe">
                <img
                  src="/images/Type=Calendar, Status=Activated.png"
                  className="w-6 h-6 mx-auto"
                />
                <p className="text-[11px]  text-primary-700 font-medium text-center">
                  Schedule
                </p>
              </div>
            </>
          ) : (
            <>
              <Link to="/">
                <div className="flex flex-col gap-[5px] cursor-pointe">
                  <img
                    src="/images/Type=Calendar, Status=Deactivated.png"
                    className="w-6 h-6 mx-auto"
                  />
                  <p className="text-[11px] text-gray-400 font-medium text-center">
                    Schedule
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
        <div className="medication-list">
          {currentURL === "/drugs/view" ? (
            <>
              <div className="flex flex-col gap-[5px] cursor-pointe">
                <img
                  src="/images/Type=Folder, Status=Activated.png"
                  className="w-6 h-6 mx-auto"
                />
                <p className="text-[11px]  text-primary-700 font-medium text-center">
                  Medication List
                </p>
              </div>
            </>
          ) : (
            <>
              <Link to="/drugs/view">
                <div className="flex flex-col gap-[5px] cursor-pointe">
                  <img
                    src="/images/Type=Folder, Status=Deactivated.png"
                    className="w-6 h-6 mx-auto"
                  />
                  <p className="text-[11px] text-gray-400 font-medium text-center">
                    Medication List
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
        <div className="setting">
          {currentURL === "/setting" ? (
            <>
              <div className="flex flex-col gap-[5px] cursor-pointe">
                <img
                  src="/images/Type=Settings, Status=Activated.png"
                  className="w-6 h-6 mx-auto"
                />
                <p className="text-[11px]  text-primary-700 font-medium text-center">
                  Setting
                </p>
              </div>
            </>
          ) : (
            <>
              <Link to="/setting">
                <div className="flex flex-col gap-[5px] cursor-pointe">
                  <img
                    src="/images/Type=Settings, Status=Deactivated.png"
                    className="w-6 h-6 mx-auto"
                  />
                  <p className="text-[11px] text-gray-400 font-medium text-center">
                    Setting
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
      </footer>
    </>
  );
}

export default Footer;
