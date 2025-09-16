import { useUnit } from "effector-react";

// import { Slider } from "shared/ui/slider";
// HowItWorkGuide
import { LaunchTokenGuide } from "./components";
import { $isVisibleSlider } from "../model";

export const Guides = () => {
  const isVisibleSlider = useUnit($isVisibleSlider);

  if(!isVisibleSlider) return null;

  return (
    <>
      {/* <Slider
        classNameEmbla="flex sm:hidden mt-2"
        className="w-full"
        options={{ dragFree: false, slidesToScroll: 'auto' }}
      >
        <div className="w-full flex touch-pan-y">
          <LaunchTokenGuide />
          <HowItWorkGuide />
        </div>
      </Slider> */}

      
      {/* hidden sm:flex */}
      <LaunchTokenGuide className="mt-4 xl:mt-0" />
    </>
  );
};
