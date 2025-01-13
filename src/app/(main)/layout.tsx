import NavigationSidebar from "@/components/navigation/navigation-sidebar"


const MainLayout = async ({ children }: {
    children: React.ReactNode
}) => {

    return (
        <div className="h-full">
            <div className=" hidden md:flex md:z-50 flex-col fixed h-full w-[72px]">
                <NavigationSidebar />
            </div>
            <main className="md:pl-[72px] h-full">
                {children}
            </main>
        </div>
    )
}

export default MainLayout