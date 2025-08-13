interface SpeakIconProps {
  fill?: string;
  stroke?: string;
  width?: number | string;
  height?: number | string;
}

const SpeakIcon = ({ fill = '#F0F0F0', stroke = 'inherit', width = 52, height = 52 }: SpeakIconProps) => (
  <svg width={width} height={height} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="26" cy="26" r="26" fill={fill} />
    <path
      d="M8.83594 20.7187V31.2812H16.2839L25.5937 40.0833V11.9167L16.2839 20.7187H8.83594ZM21.8698 20.4195V31.5805L17.8293 27.7604H12.5599V24.2396H17.8293L21.8698 20.4195ZM33.9727 26C33.9727 22.8841 32.0734 20.2082 29.3177 18.9055V33.0769C32.0734 31.7918 33.9727 29.1159 33.9727 26ZM29.3177 10.5611V14.1876C34.6988 15.7016 38.6276 20.4195 38.6276 26C38.6276 31.5805 34.6988 36.2984 29.3177 37.8124V41.4389C36.7842 39.8369 42.3516 33.5346 42.3516 26C42.3516 18.4654 36.7842 12.1631 29.3177 10.5611Z"
      fill="#B3B3B3"
    />
  </svg>
);

export default SpeakIcon;
