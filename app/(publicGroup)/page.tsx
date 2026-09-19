import { Button } from "@/components/ui/button";

export default async function HomePage() {
  
  // const user=await getMe();

  // console.log(user)
  
  return (
    <div>
      Hello Next.js
      <Button size={"xs"} variant={"destructive"}>
        Click me
      </Button>
    </div>
  );
}
