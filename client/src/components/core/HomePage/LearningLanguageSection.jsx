import React from "react";
import HighlightText from "./HighlightText";
import know_your_progress from "../../../assets/Images/know_your_progress.png";
import compare_with_others from "../../../assets/Images/compare_with_others.png";
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png";
import CTAButton from "./CTAButton";

function LearningLanguageSection() {
  return (
    <div className="mt-32">
      <div className="flex flex-col gap-5 items-center ">
        <div className="text-4xl font-bold text-center">
          Your swiss knife for <HighlightText text={"learning any language"} />
        </div>
        <div className="text-center text-[#424854] mx-auto text-base mt-3 w-[70%]">
          Using spin making learning multiple languages easy. with 20+ languages
          realistic voice-over, progress tracking, custom schedule and more.
        </div>
      </div>

      <div className="flex flex-row items-center mt-5">
        <img
          src={know_your_progress}
          alt="know_your_progress"
          className="object-contain mr-[-120px]"
        />
        <img
          src={compare_with_others}
          alt="compare_with_others"
          className="object-contain mr-[-150px] "
        />
        <img
          src={plan_your_lesson}
          alt="plan_your_lesson"
          className="object-contain"
        />
      </div>

      <div className="w-fit mx-auto mb-20">
        <CTAButton active={true} linkTo={"/signup"}>
          Learn More
        </CTAButton>
      </div>
    </div>
  );
}

export default LearningLanguageSection;
