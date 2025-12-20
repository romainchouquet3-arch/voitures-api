import { localCarsdata } from "./mock-data.js"

const cardsContainer = document.querySelector(".card-cont")

const formatPrice = (price) =>
	new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(price)

const buildCard = (car) => {
	const article = document.createElement("article")
	article.className = "card shadow-sm"
	article.innerHTML = `
        <a href="car.html?id=${car.id}">
            <img
                src="${car.imageUrl}"
                class="card-img-top object-fit-fill"
                alt="${car.brand} ${car.model}"
            />
        </a>
        <div class="card-body">
            <h5 class="card-title">${car.year} ${car.brand} ${car.model}</h5>
            <p class="card-text">${car.description}</p>
            <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">${formatPrice(car.price)}</span>
                <a href="car.html?id=${car.id}" class="btn btn-primary">See more</a>
            </div>
        </div>
    `
	return article
}

const renderCars = (cars) => {
	if (!cardsContainer) return
	cardsContainer.innerHTML = ""
	cars.forEach((car) => {
		const card = buildCard(car)
		cardsContainer.appendChild(card)
	})
}

renderCars(localCarsdata)
