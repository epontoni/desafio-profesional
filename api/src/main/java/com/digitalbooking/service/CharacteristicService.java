package com.digitalbooking.service;

import com.digitalbooking.dto.CharacteristicRequest;
import com.digitalbooking.dto.CharacteristicResponse;
import com.digitalbooking.exception.DuplicateResourceException;
import com.digitalbooking.exception.ResourceNotFoundException;
import com.digitalbooking.model.Characteristic;
import com.digitalbooking.repository.CharacteristicRepository;
import com.digitalbooking.util.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CharacteristicService {

    private final CharacteristicRepository characteristicRepository;
    private final DtoMapper dtoMapper;

    @Autowired
    public CharacteristicService(CharacteristicRepository characteristicRepository, DtoMapper dtoMapper) {
        this.characteristicRepository = characteristicRepository;
        this.dtoMapper = dtoMapper;
    }

    public List<CharacteristicResponse> getAllCharacteristics() {
        return characteristicRepository.findAll().stream()
                .map(dtoMapper::toCharacteristicResponse)
                .collect(Collectors.toList());
    }

    public CharacteristicResponse getCharacteristicById(Long id) {
        Characteristic characteristic = getCharacteristicEntityById(id);
        return dtoMapper.toCharacteristicResponse(characteristic);
    }

    public Characteristic getCharacteristicEntityById(Long id) {
        return characteristicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Característica no encontrada con ID: " + id));
    }

    public List<Characteristic> getCharacteristicEntitiesByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return characteristicRepository.findAllById(ids);
    }

    @Transactional
    public CharacteristicResponse createCharacteristic(CharacteristicRequest request) {
        if (characteristicRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("La característica ya existe con el nombre proporcionado.");
        }

        Characteristic characteristic = new Characteristic(
                request.getName(),
                request.getIcon()
        );

        Characteristic saved = characteristicRepository.save(characteristic);
        return dtoMapper.toCharacteristicResponse(saved);
    }

    @Transactional
    public CharacteristicResponse updateCharacteristic(Long id, CharacteristicRequest request) {
        Characteristic existing = getCharacteristicEntityById(id);

        if (!existing.getName().equalsIgnoreCase(request.getName()) &&
                characteristicRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Ya existe otra característica con el nombre: " + request.getName());
        }

        existing.setName(request.getName());
        existing.setIcon(request.getIcon());

        Characteristic updated = characteristicRepository.save(existing);
        return dtoMapper.toCharacteristicResponse(updated);
    }

    @Transactional
    public void deleteCharacteristic(Long id) {
        if (!characteristicRepository.existsById(id)) {
            throw new ResourceNotFoundException("Característica no encontrada con ID: " + id);
        }
        characteristicRepository.deleteById(id);
    }
}
