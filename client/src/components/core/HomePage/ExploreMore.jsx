import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";
const tabsName = [
  "Free",
  "New to Coding",
  "Most Popular",
  "Skills Paths",
  "Career Paths",
];

function ExploreMore() {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );
  const setMyCards = (value) => {
    setCurrentTab(value);
    const selectedTab = HomePageExplore.find(
      (course) => course.tag.toLowerCase() === value.toLowerCase()
    );
    if (selectedTab) {
      setCourses(selectedTab.courses);
      setCurrentCard(selectedTab.courses[0].heading);
    }
  };
  return (
    <div className="">
      <div className="text-4xl font-bold text-center">
        Unlock the <HighlightText text={"Power of Code"} />
      </div>
      <p className="text-center text-[#a0a8b8] font-semibold text-lg mt-3">
        Learn to Build Anything You Can Imagine
      </p>

      <div className="flex flex-row  rounded-full gap-5 bg-[#161D29] p-1 mb-16 mt-5   border-b border-[#AFB2BF]">
        {tabsName.map((element, index) => {
          return (
            <div
              className={`text-[16px] flex row items-center
              ${
                currentTab === element
                  ? "bg-[#000814] text-[#F1F2FF] "
                  : "text-[#999DAA] "
              }
              rounded-full transition-all duration-200 cursor-pointer hover:bg-[#000814] px-5 py-2 hover:text-[#F1F2FF]`}
              onClick={() => setMyCards(element)}
              key={index}
            >
              {element}
            </div>
          );
        })}
      </div>

      {/* course card  */}
      <div className="absolute -translate-x-[20%] -translate-y-[0%]   flex flex-row flex-wrap gap-10 justify-between w-full">
        {courses.map((element, index) => {
          return (
            <CourseCard
              key={index}
              cardData={element}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ExploreMore;
