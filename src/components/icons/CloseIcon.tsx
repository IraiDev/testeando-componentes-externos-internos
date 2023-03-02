export function CloseIcon({
   size = 24,
   color = '#2c3e50',
   strokeWidth = 1.5,
}: {
   color?: string
   size?: string | number
   strokeWidth?: number | string
}) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         className="icon icon-tabler icon-tabler-x text-inherit"
         width={size}
         height={size}
         viewBox="0 0 24 24"
         strokeWidth={strokeWidth}
         stroke={color}
         fill="none"
         strokeLinecap="round"
         strokeLinejoin="round"
      >
         <path stroke="none" d="M0 0h24v24H0z" fill="none" />
         <line x1="18" y1="6" x2="6" y2="18" />
         <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
   )
}
