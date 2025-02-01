import React from "react";
import dayCabAveritt from "../../static/images/averitt-daycab.jpg";
import sleeperAveritt from "../../static/images/averitt-sleeper.jpg";
import dayCabAdams from "../../static/images/adams.jpg";
import sleeperAdams from "../../static/images/adams.jpg";
import dayCabWestern from "../../static/images/western.jpg";
import sleeperWestern from "../../static/images/western.jpg";
//import dayCabWesternStar from "../../static/images/westernstar-daycab.jpg";
//import sleeperWesternStar from "../../static/images/westernstar-sleeper.jpg";
//import dayCabTitans from "../../static/images/titans-daycab.jpg";
//import sleeperTitans from "../../static/images/titans-sleeper.jpg";
//import defaultTruck from "../../static/images/default-truck.jpg"; // Default image

const truckImages = {
  "Adams-Day Cab": dayCabAdams,
  "Adams-Sleeper": sleeperAdams,
  "Averitt-Day Cab": dayCabAveritt,
  "Averitt-Sleeper": sleeperAveritt,
  "Western-Day Cab": dayCabWestern,
  "Western-Sleeper": sleeperWestern,
  //"Western Star-Day Cab": dayCabWesternStar,
  //"Western Star-Sleeper": sleeperWesternStar,
  //"Titans-Day Cab": dayCabTitans,
  //"Titans-Sleeper": sleeperTitans,
};

const TruckImage = ({ truckCompany, truckType }) => {
  // ** Remove apostrophe from "Adam's" **
  const sanitizedCompany = truckCompany.replace(/'/g, "");
  const imageKey = `${sanitizedCompany}-${truckType}`;
  const truckImage = truckImages[imageKey]; // Use default if not found

  return (
    <div className="truck-image-container">
      <img src={truckImage} alt={`${truckCompany} ${truckType}`} className="truck-image" />
    </div>
  );
};

export default TruckImage;
