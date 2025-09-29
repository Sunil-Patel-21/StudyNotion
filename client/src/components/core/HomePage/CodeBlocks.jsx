import CTAButton from "./CTAButton";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { TypeAnimation } from 'react-type-animation';

function CodeBlocks({
  position,
  heading,
  subHeading,
  ctaBtn1,
  ctaBtn2,
  codeblock,
  backgroundGradient,
  codeColor,
}) {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10 `}>
      {/* section 1 */}

      <div className="w-[50%] flex flex-col gap-8">
        {heading}

        <div className="text-[#838894] font-bold ">
          {subHeading}

          <div className="flex  gap-7 mt-7">

            <CTAButton active={ctaBtn1.active} linkTo={ctaBtn1.linkTo}>
              <div className="flex gap-2 items-center ">
                {ctaBtn1.btnText} <MdOutlineArrowRightAlt />
              </div>
            </CTAButton>

            <CTAButton active={ctaBtn2.active} linkTo={ctaBtn2.linkTo}>
                {ctaBtn2.btnText} 
            </CTAButton>

          </div>

        </div>

      </div>

    {/* section 2 */}

    <div className="h-fit flex flex-row  w-[100%] py-4 lg:w-[500px] border" >
     

        {/*HW -> bg gradient  */}
        <div className="text-center flex flex-col w-[10%] text-[#6E727F] font-bold">
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>
            <p>12</p>
        </div>

        <div className={`w-[90%] flex flex-col gap-2 font-bold ${codeColor} pr-2 ${backgroundGradient}`}>
          <TypeAnimation 
            sequence={[
                codeblock,
                1000,
                ""
            ]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={true}
            style={{
                whiteSpace: "pre-line",
                display: "block",
                fontSize: "1em"
            }}
          />  
        </div>

    </div>

    </div>
  );
}
export default CodeBlocks;
