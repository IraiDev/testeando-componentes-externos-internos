import { ReactNode } from 'react'

export function AvatarSelect({ avatar, alt }: { avatar: string | ReactNode; alt: string }) {
   if (!Boolean(avatar)) return null
   return (
      <>
         {typeof avatar === 'string' ? (
            <img className="h-6 w-6 rounded-full object-cover" src={avatar} alt={alt} />
         ) : (
            <span className="h-6 w-6">{avatar}</span>
         )}
      </>
   )
}
