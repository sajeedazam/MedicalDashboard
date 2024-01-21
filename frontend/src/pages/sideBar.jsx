import React from "react";

// Material UI
import { Grid, Typography } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";

export default function SideBar({
  DiagnosticReportData,
  loadMoreDiagnoseHandler,
}) {
  const [openDiagnose, setOpenDiagnose] = React.useState(false);

  const openDiagnoseHandle = () => {
    setOpenDiagnose(!openDiagnose);
  };

  const style = {
    dropDown: {
      display: "flex",
      flexWrap: "nowrap",
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    },

    roundBoxNoHorizontalSpace: {
      padding: "3vh",
      borderRadius: 10,
      border: "2px solid #3e92fb",
      backgroundColor: "#3e92fb",
      marginBottom: "1vh",
      boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1)",
    },

    roundBoxDropdownLists: {
      padding: "2vh",
      borderRadius: 10,
      border: "2px solid #e7e8eb",
      backgroundColor: "#e7e8eb",
      marginTop: "0.7vh",
      marginBottom: "0.7vh",
      boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <div>
      <div style={style.dropDown} onClick={openDiagnoseHandle}>
        <Typography variant={"h6"}>View list of diagnoses</Typography>
        {openDiagnose ? <ExpandLess /> : <ExpandMore />}
      </div>

      {openDiagnose && (
        <div style={style.roundBoxDropdownLists}>
          {DiagnosticReportData && DiagnosticReportData.length !== 0 && (
            <ul>
              {DiagnosticReportData.sort((a, b) =>
                a.ConditionTime.localeCompare(b.ConditionTime)
              )
                .map((dia) => {
                  // const modified = medication.MedicationType.replace(/\s*\(.*?\)/g, '');
                  const modified = dia.ConditionType
                    ? dia.ConditionType.charAt(0).toUpperCase() +
                      dia.ConditionType.slice(1)
                    : dia.ConditionType;
                  return {
                    type: modified,
                    time: dia.ConditionTime,
                    status: dia.ConditionStatus,
                  };
                })
                .slice(0, 5)
                .map((dia) => (
                  <li>
                    {dia.type}
                    <ul>
                      <li>Status: {dia.status}</li>
                      <li>Date: {dia.time}</li>
                    </ul>
                  </li>
                ))}
            </ul>
          )}

          {DiagnosticReportData &&
          DiagnosticReportData.length !== 0 &&
          DiagnosticReportData.length > 5 ? (
            <Link onClick={loadMoreDiagnoseHandler}>Load More...</Link>
          ) : (
            <React.Fragment></React.Fragment>
          )}

          {(!DiagnosticReportData || DiagnosticReportData.length === 0) && (
            <Typography variant="subtitle1">No Diagnostic Data</Typography>
          )}
        </div>
      )}
    </div>
  );
}
