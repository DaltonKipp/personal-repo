 // SPIRAL CUBES
 
 // MAIN SPIRALS
 for (i = [10:100]){
    assign(angle = i*360/60, distance = i*2, r = i*5){
        rotate(angle, [0, 0, i])
        translate([0, distance*0.5, distance])
        cube([i/2,i/2,i/2]);
        rotate(angle, [0, 0, i])
        translate([0, distance*0.5, distance/1.5])
        cube([i/2,i/2,i/2]);
        rotate(angle, [0, 0, i])
        translate([0, distance*0.5, distance/3])
        cube([i/2,i/2,i/2]);
        rotate(angle, [0, 0, i])
        translate([0, distance*0.5, 0])
        cube([i/2,i/2,i/2]);
    }
}

// SUPPORT SPIRALS
for (i = [10:107]){
    assign(angle = i*360/60, distance = i*2-i/2, r = i*5){
        rotate(angle, [0, 0, i])
        translate([i/1.25, distance*0.5, 0])
        cube([i/10,i/10,i*2]);
    }
}

// BOTTOM SUPPORT
translate([10,-30,-10])
cylinder(10,150,150);