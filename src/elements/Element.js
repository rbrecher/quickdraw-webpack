export default class Element {
	constructor(rect) {
		this.rect = {...rect};
	}

	move(offset) {
		this.rect.x += offset.x;
		this.rect.y += offset.y;
	}

	draw(context) {}

	isHit(point) {
		return false;
	}
}