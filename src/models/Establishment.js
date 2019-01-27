class Establishment {
  static near(lat, lng) {
    return [
      { camid: "234532", dba: "Burger King", grade: "A" },
      { camid: "255543", dba: "Poke Bowl", grade: "B" },
      { camid: "444543", dba: "Boutros", grade: "A" },
      { camid: "664563", dba: "River Deli", grade: "A" },
      { camid: "754322", dba: "Hanny Cafe", grade: "C" }
    ];
  }

  static detail(camid) {
    return {
      dba: "example",
      inspections: [
        {
          grade: "A",
          date: "1/23/2017",
          violations: [
            {
              violationCode: "10F",
              violationDescription: `Non-food contact surface improperly constructed.
        Unacceptable material used. Non-food contact surface or equipment 
        improperly maintained and/or not properly sealed, raised, spaced or 
        movable to allow accessibility for cleaning on all sides, above and 
        underneath the unit`
            },
            {
              violationCode: "08C",
              violationDescription: `Pesticide use not in accordance with label or applicable laws. 
              Prohibited chemical used/stored. Open bait station used.`
            }
          ]
        },
        {
          grade: "B",
          date: "2/24/2016",
          violations: [
            {
              violationCode: "04L",
              violationDescription: `Evidence of mice or live mice present in facility's food and
              /or non-food areas.`
            },
            {
              violationCode: "10B",
              violationDescription: `Plumbing not properly installed or maintained; anti-siphonage or 
              backflow prevention device not provided where required; equipment or floor not properly 
              drained; sewage disposal system in disrepair or not functioning properly.`
            }
          ]
        }
      ]
    };
  }
}

export default Establishment;
