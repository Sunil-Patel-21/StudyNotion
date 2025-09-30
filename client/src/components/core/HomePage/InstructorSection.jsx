import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from "react-icons/fa";
function InstructorSection() {
  return (
    <div className='mt-14 '>
      <div className='flex flex-row gap-20 items-center '>

        <div className='w-[50%]  '>
            <img src={Instructor} alt="InstructorImage" className=''/>
        </div>

        <div className='w-[50%] flex flex-col gap-10'>  

            <div className='text-4xl font-bold w-[50%]'>
                Become an <HighlightText text={"instructor"}/>
            </div>

            <p className='text-[#a7adb9] font-medium w-[100%]'>Instructors from around the world teach millions of students on StudyNotion.
            We provide the tools and skills to teach what you love.</p>

            <div className='w-fit'>
                <CTAButton active={true} linkTo={'/signup'}>
            <div className='flex flex-row gap-2 items-center'>
                Start Teaching Today  <FaArrowRight />
            </div>
            </CTAButton>
            </div>

        </div>

      </div>
    </div>
  )
}

export default InstructorSection
