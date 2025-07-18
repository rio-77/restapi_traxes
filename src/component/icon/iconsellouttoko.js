import * as React from "react"
import Svg, {
  Path,
  Rect,
  Mask,
  G,
  Defs,
  LinearGradient,
  Stop
} from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={72}
      height={95}
      viewBox="0 0 72 95"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M17.822 85.07a3.61 3.61 0 01-1.38-.25 2.284 2.284 0 01-.98-.74c-.24-.327-.367-.72-.38-1.18h1.82c.027.26.117.46.27.6.153.133.353.2.6.2.253 0 .453-.057.6-.17a.6.6 0 00.22-.49.566.566 0 00-.18-.43 1.335 1.335 0 00-.43-.28 6.503 6.503 0 00-.72-.25 7.897 7.897 0 01-1.11-.42 2.051 2.051 0 01-.74-.62c-.207-.273-.31-.63-.31-1.07 0-.653.237-1.163.71-1.53.473-.373 1.09-.56 1.85-.56.773 0 1.397.187 1.87.56.473.367.727.88.76 1.54h-1.85a.707.707 0 00-.25-.53.867.867 0 00-.59-.2.722.722 0 00-.5.17c-.127.107-.19.263-.19.47 0 .227.107.403.32.53.213.127.547.263 1 .41.453.153.82.3 1.1.44.287.14.533.343.74.61.207.267.31.61.31 1.03 0 .4-.103.763-.31 1.09a2.1 2.1 0 01-.88.78c-.387.193-.843.29-1.37.29zm8.873-2.95c0 .16-.01.327-.03.5h-3.87c.026.347.136.613.33.8.2.18.443.27.73.27.426 0 .723-.18.89-.54h1.82a2.466 2.466 0 01-.51.99c-.24.293-.544.523-.91.69-.367.167-.777.25-1.23.25-.547 0-1.034-.117-1.46-.35a2.49 2.49 0 01-1-1c-.24-.433-.36-.94-.36-1.52 0-.58.116-1.087.35-1.52a2.49 2.49 0 011-1c.426-.233.916-.35 1.47-.35.54 0 1.02.113 1.44.34.42.227.746.55.98.97.24.42.36.91.36 1.47zm-1.75-.45c0-.293-.1-.527-.3-.7-.2-.173-.45-.26-.75-.26-.287 0-.53.083-.73.25-.194.167-.314.403-.36.71h2.14zm4.362-4.07V85h-1.71v-7.4h1.71zm2.949 0V85h-1.71v-7.4h1.71zm5.539 3.18v1.42h-4.4v-1.42h4.4zm4.82 4.29c-.66 0-1.266-.153-1.82-.46a3.496 3.496 0 01-1.31-1.28 3.647 3.647 0 01-.48-1.86c0-.687.16-1.303.48-1.85a3.496 3.496 0 011.31-1.28 3.691 3.691 0 011.82-.46c.66 0 1.264.153 1.81.46.554.307.987.733 1.3 1.28.32.547.48 1.163.48 1.85s-.16 1.307-.48 1.86c-.32.547-.753.973-1.3 1.28-.546.307-1.15.46-1.81.46zm0-1.56c.56 0 1.007-.187 1.34-.56.34-.373.51-.867.51-1.48 0-.62-.17-1.113-.51-1.48-.333-.373-.78-.56-1.34-.56-.566 0-1.02.183-1.36.55-.333.367-.5.863-.5 1.49 0 .62.167 1.117.5 1.49.34.367.794.55 1.36.55zm10.052-4.09V85h-1.71v-.76c-.173.247-.41.447-.71.6a2.16 2.16 0 01-.98.22c-.427 0-.803-.093-1.13-.28a1.953 1.953 0 01-.76-.83c-.18-.36-.27-.783-.27-1.27v-3.26h1.7v3.03c0 .373.097.663.29.87.193.207.453.31.78.31.333 0 .597-.103.79-.31.193-.207.29-.497.29-.87v-3.03h1.71zm4.338 4.13V85h-.87c-.62 0-1.103-.15-1.45-.45-.346-.307-.52-.803-.52-1.49v-2.22h-.68v-1.42h.68v-1.36h1.71v1.36h1.12v1.42h-1.12v2.24c0 .167.04.287.12.36.08.073.214.11.4.11h.61z"
        fill="#000"
      />
      <Rect
        x={36.0312}
        y={38.9141}
        width={18.4687}
        height={19.614}
        rx={1}
        fill="url(#paint0_linear_976_3)"
        stroke="#fff"
      />
      <Path
        d="M40.832 47.47v-8.247a.1.1 0 01.1-.1h8.962a.1.1 0 01.1.1v8.248a.1.1 0 01-.17.07l-2.05-2.048a.1.1 0 00-.141 0l-2.15 2.148a.1.1 0 01-.14 0l-2.15-2.148a.1.1 0 00-.141 0l-2.05 2.048a.1.1 0 01-.17-.07z"
        fill="url(#paint1_linear_976_3)"
        stroke="#fff"
        strokeWidth={0.75}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40.855 14a2 2 0 012 2v19.974H35.09a2 2 0 00-2 2v5.69h-3.662v1.708h3.662v7.69H18a2 2 0 01-2-2V16a2 2 0 012-2h22.855zm-21.193 4.883h7.324v.012l.617-.616 1.208 1.208-1.825 1.825v4.895H19.663v-7.324zm6.104 1.22v.013l-2.442 2.441-1.837-1.837-.604.604v-1.22h4.882zm-4.883 3.663v-1.233l1.837 1.837.604.604.604-.604 1.838-1.837V24.986h-4.883v-1.22zm8.545-.367h9.765V21.69h-9.765v1.71zm-8.545 6.47h-1.22v7.324H26.985v-4.895l1.825-1.825-1.208-1.208-.617.616v-.012h-6.103zm4.883 1.233v-.012h-4.883v1.22l.604-.604 1.837 1.838 2.442-2.442zm-4.883 2.417V35.972h4.882V33.52l-1.837 1.837-.604.604-.604-.604-1.837-1.837zm18.31.867h-9.765v-1.71h9.765v1.71zm-19.53 6.47H26.985v.012l.617-.617 1.208 1.209-1.825 1.825v4.894H19.663V40.857zm6.103 1.22v.013l-2.442 2.44-1.837-1.836-.604.604v-1.22h4.882zm-4.883 3.662v-1.233l1.837 1.837.604.605.604-.605 1.838-1.837v2.454h-4.883v-1.22z"
        fill="url(#paint2_linear_976_3)"
      />
      <Rect
        x={1.5}
        y={1.5}
        width={68}
        height={68}
        rx={13.5}
        stroke="url(#paint3_linear_976_3)"
        strokeWidth={3}
      />
      <Mask
        id="a"
        style={{
          maskType: "alpha"
        }}
        maskUnits="userSpaceOnUse"
        x={2}
        y={2}
        width={70}
        height={70}
      >
        <Path
          d="M2 17C2 8.716 8.716 2 17 2h39.178c8.284 0 15 6.716 15 15v39.178c0 8.284-6.716 15-15 15H17c-8.284 0-15-6.716-15-15V17z"
          fill="url(#paint4_linear_976_3)"
        />
      </Mask>
      <G mask="url(#a)">
        <Path d="M17 71l54-54v54H17z" fill="#FF3636" />
      </G>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M54 45.846c-2.025 0-3.667 1.653-3.667 3.693v5.544a.917.917 0 11-1.833 0V49.54C48.5 46.478 50.962 44 54 44s5.5 2.48 5.5 5.538v5.545a.917.917 0 11-1.833 0V49.54c0-2.04-1.642-3.693-3.667-3.693zM48 57a1 1 0 00-1 1v6a1 1 0 001 1h12a1 1 0 001-1v-6a1 1 0 00-1-1H48zm8.5 4a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm-2.13.43a1 1 0 10-.75-.004v.699a.375.375 0 00.75 0v-.695z"
        fill="#fff"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_976_3"
          x1={45.2656}
          y1={38.4141}
          x2={45.2656}
          y2={59.028}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#204766" />
          <Stop offset={1} stopColor="#631D63" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_976_3"
          x1={45.4129}
          y1={39.123}
          x2={45.4129}
          y2={47.7122}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#204766" />
          <Stop offset={1} stopColor="#631D63" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_976_3"
          x1={29.4277}
          y1={14}
          x2={29.4277}
          y2={53.0625}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#204766" />
          <Stop offset={1} stopColor="#631D63" />
        </LinearGradient>
        <LinearGradient
          id="paint3_linear_976_3"
          x1={4.5}
          y1={5.5}
          x2={65}
          y2={71}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#204766" />
          <Stop offset={1} stopColor="#631D63" />
        </LinearGradient>
        <LinearGradient
          id="paint4_linear_976_3"
          x1={2}
          y1={2}
          x2={71.1781}
          y2={71.1781}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#274366" />
          <Stop offset={0.49} stopColor="#423265" />
          <Stop offset={1} stopColor="#5E2063" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default SvgComponent
