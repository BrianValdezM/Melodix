package com.music.melodix.repository;

import com.music.melodix.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findByTitleContainingIgnoreCase(String title);
    List<Song> findByArtistContainingIgnoreCase(String artist);
    List<Song> findByGenreIgnoreCase(String genre);
    List<Song> findTop10ByOrderByPlaysDesc();
}
