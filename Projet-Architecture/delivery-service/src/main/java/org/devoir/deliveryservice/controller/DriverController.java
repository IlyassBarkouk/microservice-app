package org.devoir.deliveryservice.controller;

import lombok.RequiredArgsConstructor;
import org.devoir.deliveryservice.model.Driver;
import org.devoir.deliveryservice.repository.DriverRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {
    private final DriverRepository driverRepository;

    @PostMapping
    public ResponseEntity<Driver> createDriver(@RequestBody Driver driver) {
        driver.setAvailable(true); // Par défaut disponible
        return ResponseEntity.status(HttpStatus.CREATED).body(driverRepository.save(driver));
    }

    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverRepository.findAll());
    }
}