export default function FAQ() {
    return (
        <section id="faq"
            className="container space-y-6 py-8 md:py-12 lg:py-24 bg-background">
            <div className="container flex flex-col justify-center px-4 py-8 mx-auto md:p-8">
                <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                    <h2 className="mt-8 text-4xl lg:text-6xl text-balance bg-gradient-to-br from-gray-100 to-gray-900 bg-clip-text text-center font-heading text-[40px] font-bold leading-tight tracking-[-0.02em] text-transparent drop-shadow-sm duration-300 ease-linear [word-spacing:theme(spacing.1)] md:text-7xl md:leading-[5rem]">
                        FAQ
                    </h2>

                    <p className="max-w-[85%] leading-normal sm:text-lg sm:leading-7">
                        Here are some common questions about Quick-Note. Let us know if you need more information!
                    </p>
                    <div className="space-y-4">
                        <details className="w-full border border-[hsl(215,_27.9%,_16.9%)]  rounded-lg">
                            <summary className="px-4 py-6 focus:outline-none focus-visible:dark:ring-violet-400">What is Quick-Note?</summary>
                            <p className="px-4 py-6 pt-0 -mt-4 dark:text-gray-400">
                                Quick-Note is a powerful note-taking platform that allows you to archive notes, move them to a bin, and secure your important notes with a secure note feature.
                                Users can also pin notes to ensure they appear at the top for quick access.
                            </p>
                        </details>
                        <details className="w-full border border-[hsl(215,_27.9%,_16.9%)]  rounded-lg">
                            <summary className="px-4 py-6 focus:outline-none focus-visible:dark:ring-violet-400">How do I secure my important notes in Quick-Note?</summary>
                            <p className="px-4 py-6 pt-0 -mt-4 dark:text-gray-400">
                                Quick-Note offers a secure note feature. You can mark a note as secure to ensure that only you can access it. This feature provides an extra layer of protection for your sensitive information.
                            </p>
                        </details>
                        <details className="w-full border border-[hsl(215,_27.9%,_16.9%)]  rounded-lg">
                            <summary className="px-4 py-6 focus:outline-none focus-visible:dark:ring-violet-400">Can I archive my notes in Quick-Note?</summary>
                            <p className="px-4 py-6 pt-0 -mt-4 dark:text-gray-400">
                                Yes! Quick-Note allows you to archive your notes. Archiving helps you organize your notes by moving them out of your main dashboard but still keeping them accessible whenever you need them.
                            </p>
                        </details>
                        <details className="w-full border border-[hsl(215,_27.9%,_16.9%)]  rounded-lg">
                            <summary className="px-4 py-6 focus:outline-none focus-visible:dark:ring-violet-400">How do I pin a note in Quick-Note for quick access?</summary>
                            <p className="px-4 py-6 pt-0 -mt-4 dark:text-gray-400">
                                Pinning a note in Quick-Note is easy! Just click the pin icon next to any note, and it will appear at the top of your dashboard for quick and easy access.
                            </p>
                        </details>
                        <details className="w-full border border-[hsl(215,_27.9%,_16.9%)]  rounded-lg">
                            <summary className="px-4 py-6 focus:outline-none focus-visible:dark:ring-violet-400">How do I move notes to the bin in Quick-Note?</summary>
                            <p className="px-4 py-6 pt-0 -mt-4 dark:text-gray-400">
                                To move a note to the bin, simply click on the trash icon next to the note. Once in the bin, your note will be out of your main view.
                            </p>
                        </details>
                    </div>
                </div>
            </div>
        </section>
    );
};
