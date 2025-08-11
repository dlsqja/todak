interface VoiceIconProps {
  fill?: string;
  stroke?: string;
  width?: number | string;
  height?: number | string;
}

const VoiceIcon = ({ fill = '#F0F0F0', stroke = 'inherit', width = 52, height = 52 }: VoiceIconProps) => (
  <svg width={width} height={height} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="26" cy="26" r="26" fill={fill} />
    <path
      d="M25.5939 30.401C28.6848 30.401 31.1799 28.0421 31.1799 25.1198V14.5573C31.1799 11.635 28.6848 9.27604 25.5939 9.27604C22.503 9.27604 20.008 11.635 20.008 14.5573V25.1198C20.008 28.0421 22.503 30.401 25.5939 30.401Z"
      fill="#B3B3B3"
    />
    <path
      d="M34.9038 25.1198C34.9038 29.9785 30.733 33.9219 25.5939 33.9219C20.4549 33.9219 16.284 29.9785 16.284 25.1198H12.5601C12.5601 31.3341 17.4198 36.4393 23.7319 37.3019V42.724H27.4559V37.3019C33.768 36.4393 38.6278 31.3341 38.6278 25.1198H34.9038Z"
      fill="#B3B3B3"
    />
  </svg>
);

export default VoiceIcon;
