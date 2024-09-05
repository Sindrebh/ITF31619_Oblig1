import "./style.css";
import { PortfolioArraySchema,type CreatePortfolio, type Portfolio } from "../types";
import { z } from "zod";

const CreatePortfolio: HTMLFormElement = document.getElementById("portfolio-form") as HTMLFormElement;
const projectListSection: HTMLDivElement = document.getElementById("projectList") as HTMLDivElement;
const portfolioData: Portfolio[] = [];

CreatePortfolio.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();

    const newProject = {
        id: crypto.randomUUID(),
        title: (
            (event.target as HTMLFormElement).elements.namedItem(
                "title"
            ) as HTMLInputElement
        ).value,
        body: (
            (event.target as HTMLFormElement).elements.namedItem(
                "body"
            ) as HTMLInputElement
        ).value,
        url: (
            (event.target as HTMLFormElement).elements.namedItem(
                "url"
            ) as HTMLInputElement
        )?.value || '',
        createdAt: new Date(),        
    };

    portfolioData.push(newProject);
    updatePortfolio();

    try {
        const response = await fetch("http://localhost:3999/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
        });

        if (response.status === 201) {
        console.log("Vane lagret på serveren");
        } else {
        console.error("Feil ved lagring av vane på serveren");
        }
    } catch (error) {
        console.error("Feil ved sending av data til serveren:", error);
    }
});

    function updatePortfolio() {
        console.log(portfolioData);
        if (!projectListSection) return;
        projectListSection.innerHTML = "";
    
        for (const project of portfolioData) {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.body}</p>
                <a href="${project.url}" target="_blank">GitHub Link</a>
                <p>Created on: ${new Date(project.createdAt).toLocaleDateString()}</p>
                
            `;
            projectListSection.appendChild(listItem);
        }
    }
  
    function loadFromApi() {
    fetch("http://localhost:3999")
        .then((response) => response.json())
        .then((data: unknown) => {
        try {
            // Forsøker å parse og validere dataene med Zod-skjemaet
            const validatedSubjects = PortfolioArraySchema.parse(data);

            portfolioData.push(...validatedSubjects);
            updatePortfolio();
        } catch (error) {
            if (error instanceof z.ZodError) {
            console.error("Ugyldig data mottatt fra serveren:", error.errors);
            } else {
            console.error("Uventet feil ved validering av data:", error);
            }
        }
        })
        .catch((error: Error) => {
        console.error("Feil ved henting av data fra serveren:", error);
        });
    }
  
    function loadFromJSON() {
    fetch("src/data.json")
        .then((response) => {
        // Konverterer data til json
        return response.json();
        })
        .then((data) => {
        // Henter ut div med id `data`
        const jsonId = document.getElementById("json");
        console.log(data);
        // Går igjennom dataen og lager en `p` til hvert element.
        for (const project of data) {
            const element = document.createElement("p");
            element.textContent = `${project.title}`;
            jsonId?.appendChild(element);
        }
        });
    }
  
  loadFromJSON();
  loadFromApi();