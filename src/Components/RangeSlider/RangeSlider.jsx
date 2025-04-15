import React, { useEffect, useState } from "react";
import ReactSlider from "react-slider";
import "./RangeSlider.css"; // فایل CSS برای استایل‌دهی

const RangeSlider = () => {
  const [values, setValues] = useState([0, 100]);



  return (
    <div className="range-slider-container">
      <div className="parent_section_top_input_range">
        <div className="section_top_input_right">
          <span className="section_top_input_right_span">تا</span>
          <div className="section_top_input_range_shape">
            <span className="section_top_input_range_shape_numb_span"> تومان</span>
            <span className="section_top_input_range_shape_numb">{values[1]}</span>
            <div className="depend_section_top_input_range_shape depend_section_top_input_range_shape1"></div>
          </div>
        </div>
        <div className="section_top_input_left">
          <span className="section_top_input_left_span">از</span>
          <div className="section_top_input_range_shape">
            <span className="section_top_input_range_shape_numb_span"> تومان</span>
            <span className="section_top_input_range_shape_numb">{values[0]}</span>
            <div className="depend_section_top_input_range_shape depend_section_top_input_range_shape2"></div>
          </div>
        </div>
      </div>
      <ReactSlider
        className="custom-slider"
        thumbClassName="custom-thumb"
        trackClassName="custom-track"
        value={values}
        onChange={(newValues) => setValues(newValues)}
        min={0}
        max={100}
        pearling // اجازه می‌دهد Sliderها به هم بچسبند
        minDistance={10} // حداقل فاصله بین دو Slider
        renderTrack={(props, state) => (
          <div {...props}  className={state.index === 1 ? "custom-track-1" : "custom-track-0"}
          />
        )}
      />
       <div className="parent_Lines">
        <span className="line_main_right"></span>
        <span className="line_min"></span>
        <span className="line_min"></span>
        <span className="line_min"></span>
        <span className="line_max"></span>
        <span className="line_min"></span>
        <span className="line_min"></span>
        <span className="line_min"></span>
        <span className="line_max"></span>
        <span className="line_min"></span>
        <span className="line_min"></span>
        <span className="line_min"></span>
        <span className="line_max"></span>
        <span className="line_min"></span>
        <span className="line_min"></span>
        <span className="line_min"></span>
        <span className="line_main_left"></span>
       </div>
      <div className="range-values">
        <span>گران ترین</span>  <span>ارزان ترین</span>
      </div>
    </div>
  );
};

export default RangeSlider;