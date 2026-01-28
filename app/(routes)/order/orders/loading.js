import Image from "next/image";

export default function loading(){
    return     <div className="flex justify-center pt-[25vh] h-[85vh] ">
    <Image src="/HOTPIZZALOGO.jpg" alt="Pizza Logo"  width={300} height={300} className="h-[10vh] w-[30vw]  object-contain" />
  </div>
}