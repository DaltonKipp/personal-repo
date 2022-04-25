difference() {
	sphere(r = 100);
	cube(size = 150);
}
for(i=[0:1:100]){
     cube(i,i,i);
        translate([0,i,0])
            sphere(5+i);
        translate([0,0,i])
            cylinder(i,0.2*i,0.3*i)
    translate([-10,-10,-10])
        cylinder(50,50,50);
    }
 for (i = [10:50]){
    assign (angle = i*360/20, distance = i*10, r = i*2){
        rotate(angle, [1, 1, 0])
        translate([0, distance, 0])
        sphere(r = r);
    }
}