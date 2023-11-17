import { useState } from "react";
import SUIClock from "sui-components/Clock/Clock";

const ClockExample = (props: any) => {
  const defaultTime = new Date();
	const formattedDate = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(defaultTime);
  const [selectedTime, setSelectedTime] = useState("");

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <>
      <SUIClock
        onTimeSelection={handleTimeSelection}
        disabled={false}
        defaultTime={formattedDate}
      ></SUIClock>
    </>
  );
};

export default ClockExample;
