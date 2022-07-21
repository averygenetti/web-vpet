function VPet(name='Pet', size=2, skill=10, speed=10, strength=10) {
	this.clamp = function(num, min=0, max=100) {
		return Math.min(Math.max(num, min), max);
	}

	this.name = name;
	this.gameRate = 6; // rate that stats update at, in seconds.

	this.stats = {
		// maxHP: 10,
		// HP: 10,

		// maxSkill: 100,
		// skill: skill,

		// maxSpeed: 100,
		// speed: speed,
		
		// maxStrength: 100,
		// strength: strength,

		// maxSize: size,
		// size: 0,

		// // baby: 0, child: 1, teen: 2, adult: 3, old: 4, dead: 5
		// lifeStage: 0,
		// age: 0,

		// maxMoney: 9999,
		// money: 0,

		// maxEXP: 100,
		// EXP: 0,
		// level: 1,

		maxFriendEXP: 100,
		friendEXP: 0,
		friendLevel: 1,
	};

	this.status = {
		asleep: false,
		sickness: false,
		injury: false,
		sad: false,
		mad: false,
		happy: false,
		veryHappy: false,
		severeIllness: false,
		dead: false
	};

	this.meters = {
		food: 0,
		energy: 100,
		clean: 100,
		love: 0,
		happy: 0,
	};

	this.depletionRates = {
		foodRate: 2,
		energyRate: 0.5,
		cleanRate: 1,
		loveRate: 1.2,
		happyRate: 0.2,
	}

	this.lastUpdateTime = Date.now();
	this.updateInterval = this.gameRate * 1000;

	this.updateMeters = function() {
		if (this.status.asleep) {
			this.meters.energy += this.depletionRates.energyRate*10;
		} else {
			this.meters.energy -= this.depletionRates.energyRate;
			this.meters.food -= this.depletionRates.foodRate;
			this.meters.clean -= this.depletionRates.cleanRate;
			this.meters.love -= this.depletionRates.loveRate;
			this.meters.happy -= this.depletionRates.happyRate;

			// Happy modifiers for sleep

			if (this.meters.energy > 50) {
				this.meters.happy += 0.1;
			}

			if (this.meters.energy > 80) {
				this.meters.happy += 0.4;
			}

			if (this.meters.energy < 50) {
				this.meters.happy -= 0.1;
			}

			if (this.meters.energy < 20) {
				this.meters.happy -= 0.4;
			}

			if (this.meters.energy == 0) {
				this.meters.happy -= 0.5;
			}

			// Happy modifiers for food

			if (this.meters.food > 50) {
				this.meters.happy += 0.1;
			}

			if (this.meters.food > 80) {
				this.meters.happy += 0.4;
			}

			if (this.meters.food < 50) {
				this.meters.happy -= 0.1;
			}

			if (this.meters.food < 20) {
				this.meters.happy -= 0.4;
			}

			if (this.meters.food == 0) {
				this.meters.happy -= 0.5;
			}

			// Happy modifiers for clean

			if (this.meters.clean > 50) {
				this.meters.happy += 0.1;
			}

			if (this.meters.clean > 80) {
				this.meters.happy += 0.4;
			}

			if (this.meters.clean < 50) {
				this.meters.happy -= 0.1;
			}

			if (this.meters.clean < 20) {
				this.meters.happy -= 0.4;
			}

			if (this.meters.clean == 0) {
				this.meters.happy -= 0.5;
				this.setStatus('sickness') = true;
			}

			// Happy modifiers for love

			if (this.meters.love > 50) {
				this.meters.happy += 0.1;
			}

			if (this.meters.love > 80) {
				this.meters.happy += 0.4;
			}

			if (this.meters.love < 50) {
				this.meters.happy -= 0.1;
			}
			
			if (this.meters.love < 20) {
				this.meters.happy -= 0.4;
			}

			if (this.meters.love == 0) {
				this.meters.happy -= 0.5;
			}

			// Friendship

			if (this.meters.happy > 50) {
				this.stats.friendEXP += 1
				this.setStatus('happy');
			} else {
				this.setStatus('happy', false);
			}

			if (this.meters.happy > 80) {
				this.stats.friendEXP += 2
				this.setStatus('veryHappy');
				this.setStatus('happy', false);
			} else {
				this.setStatus('veryHappy', false);
			}

			if (this.meters.happy < 10) {
				this.setStatus('sad');
			} else {
				this.setStatus('sad', false);
			}

			if (this.meters.happy == 0) {
				this.setStatus('mad');
				this.stats.friendEXP -= 0.5;
			} else {
				this.setStatus('mad', false);
			}

			if (this.stats.friendEXP >= this.stats.maxFriendEXP) {
				this.levelUpFriendship();
			}
		}
		
		this.meters.energy = this.clamp(this.meters.energy);
		this.meters.food = this.clamp(this.meters.food);
		this.meters.clean = this.clamp(this.meters.clean);
		this.meters.love = this.clamp(this.meters.love);
		this.meters.happy = this.clamp(this.meters.happy);
	};

	this.setMeterValue = function(meter, value, min=0, max=100) {
		if (this.meters[meter] != undefined) {
			this.meters[meter] = this.clamp(value, min, max);	
		}
	};

	this.changeMeterValue = function(meter, changeBy, min=0, max=100) {
		if (this.meters[meter] != undefined) {
			this.setMeterValue(meter, this.meters[meter] + changeBy, min, max);
		}
	};

	this.setStatus = function(status, value=true) {
		if (this.status[status] != undefined) {
			this.status[status] = value;
		}
	}

	this.levelUpFriendship = function() {
		this.stats.maxFriendEXP = this.stats.maxFriendEXP + Math.round(this.friendLevel^1.5);
		this.stats.friendLevel += 1;
		this.stats.fiendEXP = 0;
	};

	// actions

	this.feedMeal = function() {
		if (this.meters.food < 100) {
			this.changeMeterValue('food', 10);
			this.changeMeterValue('energy', 2);
			this.changeMeterValue('clean', -2);
		} else {
			// penalty for over-feeding!
			this.changeMeterValue('happy', -1);
		}
	};

	this.bathePet = function() {
		if (this.meters.clean < 100) {
			this.setMeterValue('clean', 100);
			this.changeMeterValue('energy', -10);
			this.changeMeterValue('happy', -2);
		}
	};

	this.petPet = function() {
		if (this.meters.love < 100) {
			this.changeMeterValue('love', 10);
			this.changeMeterValue('energy', -0.5);
			this.changeMeterValue('clean', -0.5);
		} else {
			// penalty for over-petting!
			this.changeMeterValue('happy', -1);
		}
	}

	this.putPetToBed = function() {
		this.setStatus('asleep');
	}

	this.awakenPet = function() {
		this.setStatus('asleep', false);
	}

	this.givePetMedicine = function() {
		this.setStatus('sickness', false);
		this.changeMeterValue('happy', -5);
	}

	// update loop

	this.update = function() {
		const now = Date.now();
		const delta = now - this.lastUpdateTime;

		if (delta >= this.updateInterval) {
			this.updateMeters();
			this.lastUpdateTime = now;
		}
	}
}

