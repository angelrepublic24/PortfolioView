import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return(
    <>
      <Header />
      <main id="content" className="">
        {children}
         <Footer />
      </main>

    </>
  )
}
