import SUISegment from "sui-components/Segment/Segment";

const SegmentExample = (props: any) => {
  const segmentOptions = ["Single Party", "Multiple Party"];
  const segmentlabel = "Type of Bid";
  const defaultSegment = "Single Party";
  const labelIcon = true;

  const getSelectedSegment = (value: any) => {
    // console.log("selected segment", value);
  };

  return (
    <SUISegment
      segmentlabel={segmentlabel}
      segmentOptions={segmentOptions}
      getSelectedSegment={getSelectedSegment}
      defaultSegment={defaultSegment}
	  labelIcon={labelIcon}
    ></SUISegment>
  );
};

export default SegmentExample;
