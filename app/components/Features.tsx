export default function Features() {
    return (
        <section id="features" className="container py-8 md:py-12 lg:py-24 bg-background space-y-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center text-center space-y-4">
                <h2 className="mt-8 text-4xl lg:text-6xl font-heading font-bold text-transparent bg-gradient-to-br from-gray-900 via-gray-800 to-gray-400 bg-clip-text drop-shadow-sm leading-tight tracking-[-0.02em] md:text-7xl md:leading-[5rem] dark:bg-gradient-to-br dark:from-gray-100 dark:to-gray-900">
                    Features
                </h2>
                <p className="max-w-[85%] sm:text-lg sm:leading-7">
                    Quick-Note is a powerful note-taking app that simplifies your workflow. It leverages Next.js 15, ArcJet, TailwindCSS, Mongoose, and TypeScript to offer a seamless experience.
                </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                {[
                    {
                        title: "Authentication",
                        description: "Protects your notes, ensuring exclusive access at all times.",
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-plus">
                                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                                <path d="M9 12h6" />
                                <path d="M12 9v6" />
                            </svg>
                        ),
                    },
                    {
                        title: "Dashboard",
                        description: "Easily manage and access all your notes from the dashboard.",
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard">
                                <rect width="7" height="9" x="3" y="3" rx="1" />
                                <rect width="7" height="5" x="14" y="3" rx="1" />
                                <rect width="7" height="9" x="14" y="12" rx="1" />
                                <rect width="7" height="5" x="3" y="16" rx="1" />
                            </svg>
                        ),
                    },
                    {
                        title: "Settings",
                        description: "Customize your app settings for a personalized experience.",
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        ),
                    },
                    {
                        title: "SecureNotes",
                        description: "Secure your notes with a passcode for extra security.",
                        icon: (
                            <svg width={48} height={48} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">

                                <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />

                                <g id="SVGRepo_iconCarrier"> <path d="M20 10V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H10.5M13 11H8M11 15H8M16 7H8M19.25 17V15.25C19.25 14.2835 18.4665 13.5 17.5 13.5C16.5335 13.5 15.75 14.2835 15.75 15.25V17M15.6 21H19.4C19.9601 21 20.2401 21 20.454 20.891C20.6422 20.7951 20.7951 20.6422 20.891 20.454C21 20.2401 21 19.9601 21 19.4V18.6C21 18.0399 21 17.7599 20.891 17.546C20.7951 17.3578 20.6422 17.2049 20.454 17.109C20.2401 17 19.9601 17 19.4 17H15.6C15.0399 17 14.7599 17 14.546 17.109C14.3578 17.2049 14.2049 17.3578 14.109 17.546C14 17.7599 14 18.0399 14 18.6V19.4C14 19.9601 14 20.2401 14.109 20.454C14.2049 20.6422 14.3578 20.7951 14.546 20.891C14.7599 21 15.0399 21 15.6 21Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> </g>

                            </svg>
                        ),
                    },
                    {
                        title: "Pin",
                        description: "Pin important notes for easy access and quick navigation.",
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path fill="#ffffff" d="M17 4v7l2 3v2h-6v5l-1 1-1-1v-5H5v-2l2-3V4c0-1.1.9-2 2-2h6c1.11 0 2 .89 2 2zM9 4v7.75L7.5 14h9L15 11.75V4H9z" />
                            </svg>

                        ),
                    },
                    {
                        title: "Management",
                        description: "Create, edit, save, and delete notes with ease.",
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-kanban">
                                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                                <path d="M8 10v4" />
                                <path d="M12 10v2" />
                                <path d="M16 10v6" />
                            </svg>
                        ),
                    },
                ].map(({ title, description, icon }, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg border border-[hsl(215,_27.9%,_16.9%)] bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            {icon}
                            <div className="space-y-2">
                                <h3 className="font-bold">{title}</h3>
                                <p className="text-sm text-muted-foreground">{description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
