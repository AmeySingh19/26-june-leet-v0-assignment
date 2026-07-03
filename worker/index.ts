import { createClient } from "redis";
import fs from "fs";
import { spawn } from "child_process";
import { prisma } from "./db";

const client = createClient()
client.connect()
    .then(async () => {
        console.log("Worker started, connected to Redis, waiting for submissions...");
        while(1) {
            const response = await client.rPop("problems");
            if (!response) {
                await new Promise((r) => setTimeout(r, 1000));
                continue;
            }

            const parsedResponse = JSON.parse(response);
            const code = parsedResponse.code;
            const language = parsedResponse.language;
            const submissionId = parsedResponse.submissionId;
            console.log("processing question for user " + parsedResponse.userId);
            let finalOutput = "";

            //TODO: Add a timeout so that if the user code takes more than 5 seconds to execute
            // you change the status in the DB to TLE. 

            if (language === "cpp") {
                console.log("Running users c++ code")
                const filePath = __dirname + "/code/a.cpp";
                fs.writeFileSync(filePath, code);
                const reponseCompiler = spawn("g++", [filePath, "-o", "./code/out"]);
                let compileOutput = "";
                let compileError = "";

                reponseCompiler.stdout.on("data", (chunk) => {
                    compileOutput += chunk.toString();
                });
                reponseCompiler.stderr.on("data", (chunk) => {
                    compileError += chunk.toString();
                });

                let exitCodeCompiler = null;
                await new Promise<void>(resolve => {
                    reponseCompiler.on("close", async (exitCode) => {
                        exitCodeCompiler = exitCode;
                        if (exitCode !== 0) {
                            const errMessage = compileError || compileOutput || "Compilation failed";
                            await prisma.submissions.update({
                                where: {
                                    id: submissionId
                                },
                                data: {
                                    status: "Failure",
                                    output: errMessage
                                }
                            })
                        }
                        resolve()
                    })
                })
                
                if (exitCodeCompiler !== 0) {
                    continue;
                }

                const response = spawn("./code/out");
                let runtimeOutput = "";
                let runtimeError = "";

                response.stdout.on("data", (chunk) => {
                    runtimeOutput += chunk.toString();
                })
                response.stderr.on("data", (chunk) => {
                    runtimeError += chunk.toString();
                })

                await new Promise<void>(resolve => {
                    response.on("close", async (exitCode) => {
                        console.log(exitCode);
                        if (exitCode === 0) {
                            await prisma.submissions.update({
                                where: {
                                    id: submissionId
                                },
                                data: {
                                    status: "Success",
                                    output: runtimeOutput
                                }
                            })
                        } else {
                            await prisma.submissions.update({
                                where: {
                                    id: submissionId
                                },
                                data: {
                                    status: "Failure",
                                    output: runtimeOutput + (runtimeError ? "\n" + runtimeError : "")
                                }
                            })
                        }
                        resolve()
                    })
                })

                // sandboxing
            }

            if (language === "js") {
                const filePath = __dirname + "/code/a.js";
                console.log("Running users js code")
                fs.writeFileSync(filePath, code);
                const response = spawn("node", [filePath]);
                let runtimeOutput = "";
                let runtimeError = "";

                response.stdout.on("data", (chunk) => {
                    runtimeOutput += chunk.toString();
                })
                response.stderr.on("data", (chunk) => {
                    runtimeError += chunk.toString();
                })

                await new Promise<void>(resolve => {
                    response.on("close", async (exitCode) => {
                        if (exitCode === 0) {
                            await prisma.submissions.update({
                                where: {
                                    id: submissionId
                                },
                                data: {
                                    status: "Success",
                                    output: runtimeOutput
                                }
                            })
                        } else {
                            await prisma.submissions.update({
                                where: {
                                    id: submissionId
                                },
                                data: {
                                    status: "Failure",
                                    output: runtimeOutput + (runtimeError ? "\n" + runtimeError : "")
                                }
                            })
                        }
                        resolve()
                    })
                })
            }

            if (language === "py") {
                const filePath = __dirname + "/code/a.py";
                console.log("Running users py code")
                fs.writeFileSync(filePath, code);
                const pythonCmd = process.platform === "win32" ? "python" : "python3";
                const response = spawn(pythonCmd, [filePath]);
                let runtimeOutput = "";
                let runtimeError = "";

                response.stdout.on("data", (chunk) => {
                    runtimeOutput += chunk.toString();
                })
                response.stderr.on("data", (chunk) => {
                    runtimeError += chunk.toString();
                })

                await new Promise<void>(resolve => {
                    response.on("close", async (exitCode) => {
                        if (exitCode === 0) {
                            await prisma.submissions.update({
                                where: {
                                    id: submissionId
                                },
                                data: {
                                    status: "Success",
                                    output: runtimeOutput
                                }
                            })
                        } else {
                            await prisma.submissions.update({
                                where: {
                                    id: submissionId
                                },
                                data: {
                                    status: "Failure",
                                    output: runtimeOutput + (runtimeError ? "\n" + runtimeError : "")
                                }
                            })
                        }
                        resolve()
                    })
                })
            }
            // Update the status in the DB
        }
    });
