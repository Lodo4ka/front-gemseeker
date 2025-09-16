import { useUnit } from "effector-react";

import { Typography, TypographyProps } from "shared/ui/typography"
import { GuideTemplate } from "../template"
import { Button } from "shared/ui/button"
import { openedHowItWorksModal } from "features/how-it-works/model";
import { guideLaunchHowItWork } from "../../../model"

const textProps: TypographyProps = {
    className: "!gap-[4px] text-[20px] uppercase md:text-[24px] md:leading-8 lg:text-[36px] lg:leading-10",
    weight: "semibold",
    as: "span",
    color: "yellow",
};

const Titlte = () => (
    <>
        <Typography
            weight="semibold"
            className="!gap-2 text-[20px] uppercase md:text-[24px] md:leading-8 lg:text-[36px] lg:leading-10"
        >
            How
        </Typography>
        
        <Typography {...textProps} >
            <Typography {...textProps} color='primary'>it</Typography>
            works
        </Typography>
    </>
)

const Content = () => {
    const [openHowItWorksModal] = useUnit([openedHowItWorksModal]);
    
    return (
        <Button onClick={openHowItWorksModal} theme="quaternary">
            Read
        </Button>
    )
}

export const HowItWorkGuide = () => {
    const [isGuideOpen, closeGuide] = useUnit([guideLaunchHowItWork.$isGuideOpen, guideLaunchHowItWork.closedGuide]);

    return(
        <GuideTemplate 
            title={<Titlte />}
            content={<Content />}
            closeGuide={closeGuide}
            isGuideOpen={isGuideOpen}
            // className="pl-[10px]"
        />
    )
}