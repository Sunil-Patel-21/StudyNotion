import React from "react";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import timeLineImage from "../../../assets/Images/timeLineImage.png";

const timeLine = [
  {
    Logo: Logo1,
    heading: "Leadership",
    description: "Fully committed to the success company",
  },
  {
    Logo: Logo2,
    heading: "Responsibility",
    description: "Students will always be our top priority",
  },
  {
    Logo: Logo3,
    heading: "Flexibility",
    description: "The ability to switch is an important skills",
  },
  {
    Logo: Logo4,
    heading: "Solve the problem",
    description: "Code your way to a solution",
  },
];
function TimeLineSection() {
  return (
    <div>
      <div className="flex flex-row gap-15 items-center">
        <div className="w-[45%] flex flex-col gap-5">
          {timeLine.map((element, index) => {
            return (
              <div key={index} className="flex flex-row gap-6">
                <div className="w-[50px] h-[50px] bg-white flex items-center rounded-full justify-center drop-shadow-white shadow-2xl ">
                  <img src={element.Logo} alt={element.heading}  />

                </div> 
                <div>
                  <h2 className="font-semibold text-[18px]">
                    {element.heading}
                  </h2>
                  <p className="text-base">{element.description}</p>
                 <p className={`${index === timeLine.length - 1 ? "hidden" : " border-l border-[#20a579] border-dashed h-16 translate-x-[-18%] translate-y-[15%]" }`}></p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative shadow-blue-900 shadow-2xl">
          <img src={timeLineImage} alt="timeLineImage" />
          <div className="absolute bg-[#014A32] flex flex-row text-white uppercase py-7 gap-10 text-2xl left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="flex items-center gap-5 flex-row border-r border-[#a8edd9] px-7">
              <p className="text-3xl font-bol ">10</p>
              <p className="text-[#037957] text-sm font-bold">
                Years of Experience
              </p>
            </div>

            <div className="flex items-center gap-5 flex-row px-7 ">
              <p className="text-3xl font-bol ">250</p>
              <p className="text-[#037957] font-bold text-sm">
                Type of Courses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeLineSection;
