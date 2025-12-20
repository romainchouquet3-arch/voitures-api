import { localCarsdata } from "./mock-data.js"

const detailContainer = document.querySelector("#car-detail")
const pageTitle = document.querySelector("#car-page-title")

const formatPrice = (price) =>
	new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(price)

const getCurrentCar = () => {
	const params = new URLSearchParams(window.location.search)
	const carId = Number(params.get("id"))
	return localCarsdata.find((car) => car.id === carId)
}

const renderDetail = (car) => {
	if (!detailContainer) return
	if (!car) {
		detailContainer.innerHTML = `
            <div class="text-center">
                <p class="mb-3">Nous n'avons pas trouvé cette voiture.</p>
                <a class="btn btn-primary" href="./index.html">Retour au catalogue</a>
            </div>
        `
		return
	}

	const title = `${car.year} ${car.brand} ${car.model}`
	if (pageTitle) {
		pageTitle.textContent = title
	}

	detailContainer.innerHTML = `
        <div class="row">
            <div class="col-12 col-lg-6 mb-4 mb-lg-0">
                <img
                    src="${car.imageUrl}"
                    class="img-fluid rounded"
                    alt="${car.brand} ${car.model}"
                />
            </div>
            <div class="col-12 col-lg-6 p-2">
                <h3>Vehicle specification</h3>
                <table class="table table-striped">
                    <tbody>
                        <tr>
                            <th scope="row">Year</th>
                            <td>${car.year}</td>
                        </tr>
                        <tr>
                            <th scope="row">Make</th>
                            <td>${car.brand}</td>
                        </tr>
                        <tr>
                            <th scope="row">Model</th>
                            <td>${car.model}</td>
                        </tr>
                        <tr>
                            <th scope="row">Color</th>
                            <td>${car.color}</td>
                        </tr>
                        <tr>
                            <th scope="row">Mileage</th>
                            <td>${car.mileage.toLocaleString("fr-FR")} km</td>
                        </tr>
                        <tr>
                            <th scope="row">Description</th>
                            <td>${car.description}</td>
                        </tr>
                        <tr>
                            <th scope="row">Price</th>
                            <td>${formatPrice(car.price)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
}

renderDetail(getCurrentCar())
