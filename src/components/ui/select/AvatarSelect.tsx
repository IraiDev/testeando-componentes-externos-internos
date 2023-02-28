export function AvatarSelect({ type, avatar }: { type: string; avatar: any }) {
   if (type === '' || !Boolean(avatar)) return null
   return <span>{type === 'string' ? <img src={avatar} alt="asdasdasdasdasd" /> : avatar}</span>
}
